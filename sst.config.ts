import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "hx2-images",
      region: "us-west-1",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
