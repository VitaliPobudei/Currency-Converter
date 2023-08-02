import "./styles.css";
import logolg from "../../../public/logo-lg.png";
import logosm from "../../../public/logo-sm.png";
import arm from "../../../public/arm.png";
import telephon from "../../assets/icons/telephon.svg";
import appeal from "../../assets/icons/appeal.svg";
import glasses from "../../assets/icons/glasses.svg";
import search from "../../assets/icons/search.svg";

const Header = () => {
  return (
    <header className="header">
      <img
        className="logosm"
        src={logosm}
        alt="logo"
        width="40px"
        height="34px"
      />
      <div className="attributes">
        <img src={logolg} alt="logo" width="240px" height="34px" />
        <img src={arm} alt="coat of arms" width="40px" height="40px" />
      </div>

      <div className="block_option">
        <div className="block_phones">
          <img src={telephon} alt="telephon" width="22px" />
          <div className="phones">
            <a href="tel:+375173752002" title="Контакт-центр">
              +375 (17) 375 20 02 (городской)
            </a>
            <a href="tel:+375339001155" title="Контакт-центр">
              +375 (33) 900 11 55 (МТС)
            </a>
          </div>
        </div>
        <div className="box_message">
          <img src={appeal} alt="appeal" width="22px" height="22px" />
          <span>электронные</span>
          <span>обращения</span>
        </div>
        <form action="">
          <input type="text" placeholder="Поиск по сайту" />
          <img src={search} alt="search" />
        </form>
        <div className="vision">
          <img src={glasses} alt="glasses" width="24px" height="24px" />
          <span>Версия для слабовидящих</span>
        </div>
        <span>RU</span>
      </div>
    </header>
  );
};

export default Header;
