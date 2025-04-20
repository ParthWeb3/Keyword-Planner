const { LRUCache } = require('lru-cache');

class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.suggestions = [];
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(keyword, searchVolume) {
    let node = this.root;
    for (const char of keyword.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.suggestions.push({ keyword, searchVolume });
    node.suggestions.sort((a, b) => b.searchVolume - a.searchVolume); // Sort by search volume
    if (node.suggestions.length > 10) {
      node.suggestions.pop(); // Limit suggestions to top 10
    }
  }

  search(prefix) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    return node.suggestions;
  }
}

class Autocomplete {
  constructor() {
    this.cache = new LRUCache({ max: 1000 });
    this.trie = new Trie();
  }

  addKeyword(keyword, searchVolume) {
    this.trie.insert(keyword, searchVolume);
  }

  getSuggestions(prefix) {
    if (this.cache.has(prefix)) {
      return this.cache.get(prefix);
    }
    const suggestions = this.trie.search(prefix);
    this.cache.set(prefix, suggestions);
    return suggestions;
  }
}

module.exports = Autocomplete;
