import { Github, Linkedin } from "lucide-react";
import "./FooterStyle.css";
const Footer = () => {
  return (
    <>
      <section className="footer">
        <p>
          Bate Papo Programático © Desenvolvido por{" "}
          <a href="https://guilherme-feitosa-cunha.vercel.app/">
            Guilherme Feitosa
          </a>
        </p>
        <div>
          <a href="https://github.com/guilherme273">
            <Github size={23} />
          </a>
          <a href="https://www.linkedin.com/in/guilherme-cunha-249529262/">
            <Linkedin size={23} />
          </a>
        </div>
      </section>
    </>
  );
};

export default Footer;
