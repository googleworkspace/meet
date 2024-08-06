export function createAddonSession() {
let session;

 session = window.meet.addon.createAddonSession({
   cloudProjectNumber: `${process.env.NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER}`,
 });

 return session;
}