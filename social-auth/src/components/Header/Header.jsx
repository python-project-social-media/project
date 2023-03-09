import "./Header.css";

function Header() {
  return (
    <div className="flex justify-center">
      <div className="container lg:px-12">
        <div className="header flex justify-between items-center p-3">
          <div className="icon">
            <img
              src="https://www.freepnglogos.com/uploads/sport-png/sport-run-for-fun-south-cambs-district-council-24.png"
              alt="SportCom"
              className="w-8 h-8"
            />
          </div>
          <div className="links flex gap-6 text-[#37902F] font-semibold">
            <p className="active">Anasayfa</p>
            <p>En Popülerler</p>
            <p>Haberler</p>
            <p>Haftanın Enleri</p>
          </div>
          <div className="auth-settings flex items-center gap-4">
            <p>GİRİŞ</p>
            <button className="register-button">KAYIT OL</button>
            <div className="h-6 bg-stone-400 w-[2px]"></div>
            <p>settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
