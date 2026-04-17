#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, vec, Address, Env, String, Vec, symbol_short, Symbol};

mod token {
    soroban_sdk::contractimport!(
        file = "../target/wasm32-unknown-unknown/release/poll_token.wasm"
    );
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Poll {
    pub id: u32,
    pub creator: Address,
    pub title: String,
    pub options: Vec<String>,
    pub votes: Vec<u32>,
}

#[contracttype]
pub enum DataKey {
    Poll(u32),
    PollCount,
    Voted(u32, Address),
    TokenAddr,
}

#[contract]
pub struct VotingStore;

#[contractimpl]
impl VotingStore {
    pub fn initialize(e: Env, token_addr: Address) {
        if e.storage().instance().has(&DataKey::TokenAddr) {
            panic!("already initialized");
        }
        e.storage().instance().set(&DataKey::TokenAddr, &token_addr);
        e.storage().instance().set(&DataKey::PollCount, &0u32);
    }

    pub fn create_poll(e: Env, creator: Address, title: String, options: Vec<String>) -> u32 {
        creator.require_auth();

        let mut poll_count: u32 = e.storage().instance().get(&DataKey::PollCount).unwrap_or(0);
        poll_count += 1;

        let mut votes = vec![&e];
        for _ in 0..options.len() {
            votes.push_back(0);
        }

        let poll = Poll {
            id: poll_count,
            creator,
            title,
            options,
            votes,
        };

        e.storage().persistent().set(&DataKey::Poll(poll_count), &poll);
        e.storage().instance().set(&DataKey::PollCount, &poll_count);

        e.events().publish((symbol_short!("poll_cre"), poll_count), poll_count);

        poll_count
    }

    pub fn vote(e: Env, voter: Address, poll_id: u32, option_idx: u32) {
        voter.require_auth();

        // Check if already voted
        let voted_key = DataKey::Voted(poll_id, voter.clone());
        if e.storage().persistent().has(&voted_key) {
            panic!("already voted");
        }

        // Inter-contract call: Check token balance
        let token_addr: Address = e.storage().instance().get(&DataKey::TokenAddr).unwrap();
        let client = token::Client::new(&e, &token_addr);
        let balance = client.balance(&voter);
        
        if balance < 1 {
            panic!("must hold at least 1 VOTE token to vote");
        }

        let mut poll: Poll = e.storage().persistent().get(&DataKey::Poll(poll_id)).expect("poll not found");
        
        if option_idx >= poll.options.len() {
            panic!("invalid option index");
        }

        let mut new_votes = poll.votes;
        let current_vote_count = new_votes.get(option_idx).unwrap();
        new_votes.set(option_idx, current_vote_count + 1);
        poll.votes = new_votes;

        e.storage().persistent().set(&DataKey::Poll(poll_id), &poll);
        e.storage().persistent().set(&voted_key, &true);

        e.events().publish((symbol_short!("vote"), poll_id, option_idx), voter);
    }

    pub fn get_poll(e: Env, poll_id: u32) -> Poll {
        e.storage().persistent().get(&DataKey::Poll(poll_id)).expect("poll not found")
    }
}
