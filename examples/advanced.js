/**
 * Example 2: Advanced Obfuscation
 * Demonstrates string encoding, control flow flattening, and member expression obfuscation
 */

const config = {
  apiKey: 'sk-1234567890abcdef',
  apiUrl: 'https://api.example.com/v1',
  timeout: 5000,
  retries: 3,
};

function fetchData(endpoint) {
  const url = config.apiUrl + '/' + endpoint;
  const options = {
    headers: {
      'Authorization': 'Bearer ' + config.apiKey,
      'Content-Type': 'application/json',
    },
    timeout: config.timeout,
  };

  return fetch(url, options)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching data:', error);
      return null;
    });
}

class DataManager {
  constructor() {
    this.cache = new Map();
    this.stats = { hits: 0, misses: 0 };
  }

  get(key) {
    if (this.cache.has(key)) {
      this.stats.hits++;
      return this.cache.get(key);
    }
    this.stats.misses++;
    return null;
  }

  set(key, value) {
    this.cache.set(key, value);
  }

  getStats() {
    return {
      total: this.stats.hits + this.stats.misses,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses),
    };
  }
}

const manager = new DataManager();
manager.set('user:123', { id: 123, name: 'Alice' });
console.log(manager.get('user:123'));
console.log(manager.getStats());
