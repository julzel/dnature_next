import navigationItems from "./navigationItems";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";

const HeaderContainer = () => {
  return (
    <Header
      navigationItems={navigationItems}
      mobileNavigation={<MobileNavigation items={navigationItems} />}
    />
  );
};

export default HeaderContainer;
