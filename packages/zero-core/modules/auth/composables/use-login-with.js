// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useLoginWith = (strategy) => {
  switch (strategy) {
    case 'github': useAuthenticateGithub(); break
    case 'metamask': useAuthenticateMetamask(); break
  }
}
