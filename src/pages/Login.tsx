
const Login = () => {
  return (
    <div className="login-page">
      <form className="login-form">
        <h2 className="login-title">Login</h2>

        <input className="login-input" type="text" placeholder="Email" />
        <input className="login-input" type="password" placeholder="Mot de passe" />

        <button className="login-button" type="button">
          Se connecter
        </button>

        <a href="#" className="login-link">
          Pas de compte ? Inscrivez-vous
        </a>
      </form>
    </div>
  );
};

export default Login;