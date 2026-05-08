const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HF_API_KEY);

module.exports = hf;