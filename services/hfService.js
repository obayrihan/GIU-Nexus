let hf;

try {
  const { HfInference } = require("@huggingface/inference");
  hf = new HfInference(process.env.HF_API_KEY);
} catch {
  hf = {
    tokenClassification: async () => [],
  };
}

module.exports = hf;
