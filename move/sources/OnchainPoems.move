module OnchainPoems::onchain_poems {

   use std::string::{Self, String};
   use std::signer;

    struct Inscription has key, store {
        poem: String,
        title: String,
        author: String
    }

  public entry fun register (account: &signer, poem: String, title: String, author: String) {
    let owner = signer::address_of(account);
    let exists = exists<Inscription>(owner);
    assert!(!exists, 0);
    move_to<Inscription>(account, Inscription {
      poem: poem,
      title: title,
      author: author
    });
  }

  #[view]
  public fun get_poem (account: address): String acquires Inscription {
    let poem = borrow_global<Inscription>(account);
    poem.poem
  }
}