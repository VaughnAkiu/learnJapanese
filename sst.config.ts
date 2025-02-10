export default $config({
    app(input) {
      return {
        name: "learnJapaneseApp",
        home: "aws",
        providers: {
          aws: {
            profile: input.stage === "production" ? "prod" : "dev"
          }
        }
      };
    },
    async run() {
      // Your resources
    }
  });