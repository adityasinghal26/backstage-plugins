import { createBackend } from "@backstage/backend-defaults";
// import { createBackendModule } from "@backstage/backend-plugin-api";
// import { githubAuthenticator } from "@backstage/plugin-auth-backend-module-github-provider";
// import { authProvidersExtensionPoint, createOAuthProviderFactory } from "@backstage/plugin-auth-node";

// export const authModuleGithubProvider = createBackendModule({
//     pluginId: 'auth',
//     moduleId: 'githubProvider',
//     register(reg) {
//         reg.registerInit({
//             deps: { providers: authProvidersExtensionPoint },
//             async init({providers}) {
//                 providers.registerProvider({
//                     providerId: 'github',
//                     factory: createOAuthProviderFactory({
//                         authenticator: githubAuthenticator,
//                         async signInResolver(info, ctx) {
//                             const userRef = 'user:default/guest'; // Must be a full entity reference
//                             return ctx.issueToken({
//                             claims: {
//                                 sub: userRef, // The user's own identity
//                                 ent: [userRef], // A list of identities that the user claims ownership through
//                             },
//                             });
//                         }
//                     })
//                 })
//             }
//         })
//     }

// })

const backend = createBackend();
backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));
backend.add(import('@adityasinghal26/backstage-plugin-oracle-cloud-backend'));
backend.start();