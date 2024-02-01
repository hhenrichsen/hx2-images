import { StackContext, Api, EventBus, Bucket } from "sst/constructs";

export function API({ stack, app }: StackContext) {
  const bucket = new Bucket(stack, "public", {});

  const api = new Api(stack, "api", {
    customDomain:
      app.stage == "prod" ? "images.hx2.dev" : `${app.stage}-images.hx2.dev`,
    defaults: {
      function: {
        bind: [bucket],
      },
    },
    routes: {
      "POST /images": "packages/functions/src/upload.handler",
      "GET /images/{id}": "packages/functions/src/image.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.customDomainUrl || api.url,
  });

  return { bucket, api };
}
