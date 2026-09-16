export function formatAuthError(error) {
  if (!error) return '';
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está em uso por outra conta.';
    case 'auth/invalid-email':
      return 'O formato do e-mail informado é inválido.';
    case 'auth/weak-password':
      return 'A senha é muito fraca. Utilize no mínimo 6 caracteres.';
    case 'auth/user-not-found':
      return 'Nenhum usuário encontrado com este e-mail.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Tente novamente.';
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    case 'auth/too-many-requests':
      return 'Acesso temporariamente bloqueado por muitas tentativas falhas.';
    case 'auth/network-request-failed':
      return 'Falha de conexão com a rede. Verifique sua internet.';
    default:
      return error.message || 'Ocorreu um erro durante a autenticação.';
  }
}
