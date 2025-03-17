const { Transform } = require('stream');
const Joi = require('joi');
const LRU = require('lru-cache');

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
    node.suggestions.sort((a, b) => b.searchVolume - a.searchVolume);
    if (node.suggestions.length > 10) {
      node.suggestions.pop();
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

class KeywordProcessor {
  constructor() {
    this.cache = new LRU({ max: 1000 });
    this.trie = new Trie();
  }

  validateInput(data) {
    const schema = Joi.object({
      keyword: Joi.string().min(1).required(),
      searchVolume: Joi.number().min(0).required(),
      competition: Joi.number().min(0).max(1).required(),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new Error(`Validation Error: ${error.message}`);
    }
  }

  addKeywordToTrie(keyword, searchVolume) {
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

  processStream(stream) {
    const transformStream = new Transform({
      objectMode: true,
      transform: (chunk, encoding, callback) => {
        try {
          this.validateInput(chunk); // Ensure 'this' refers to the instance
          this.addKeywordToTrie(chunk.keyword, chunk.searchVolume); // Ensure 'this' refers to the instance
          callback(null, chunk);
        } catch (error) {
          callback(error);
        }
      },
    });

    return stream.pipe(transformStream);
  }
}

module.exports = KeywordProcessor;
