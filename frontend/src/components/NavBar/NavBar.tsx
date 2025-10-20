import React, { useContext } from 'react';
import Select from 'components/common/Select/Select';
import Logo from 'components/common/Logo/Logo';
import Version from 'components/Version/Version';
import GitHubIcon from 'components/common/Icons/GitHubIcon';
import DiscordIcon from 'components/common/Icons/DiscordIcon';
import AutoIcon from 'components/common/Icons/AutoIcon';
import SunIcon from 'components/common/Icons/SunIcon';
import MoonIcon from 'components/common/Icons/MoonIcon';
import { ThemeModeContext } from 'components/contexts/ThemeModeContext';
import ProductHuntIcon from 'components/common/Icons/ProductHuntIcon';
import { Button } from 'components/common/Button/Button';
import MenuIcon from 'components/common/Icons/MenuIcon';
import { useAppInfo } from 'lib/hooks/api/appConfig';

import { UserTimezone } from './UserTimezone/UserTimezone';
import UserInfo from './UserInfo/UserInfo';
import * as S from './NavBar.styled';

interface Props {
  onBurgerClick: () => void;
}

export type ThemeDropDownValue = 'auto_theme' | 'light_theme' | 'dark_theme';

const options = [
  {
    label: (
      <>
        <AutoIcon />
        <div>Auto theme</div>
      </>
    ),
    value: 'auto_theme',
  },
  {
    label: (
      <>
        <SunIcon />
        <div>Light theme</div>
      </>
    ),
    value: 'light_theme',
  },
  {
    label: (
      <>
        <MoonIcon />
        <div>Dark theme</div>
      </>
    ),
    value: 'dark_theme',
  },
];

const NavBar: React.FC<Props> = ({ onBurgerClick }) => {
  const { themeMode, setThemeMode } = useContext(ThemeModeContext);
  const appInfo = useAppInfo();
  const socialLinks = appInfo.data?.response.ui?.socialLinks;

  return (
    <S.Navbar role="navigation" aria-label="Page Header">
      <S.NavbarBrand>
        <S.NavbarBrand>
          <Button buttonType="text" buttonSize="S" onClick={onBurgerClick}>
            <MenuIcon />
          </Button>

          <S.Hyperlink to="/">
            <Logo />
            kafbat UI
          </S.Hyperlink>

          <S.NavbarItem>
            <Version />
          </S.NavbarItem>
        </S.NavbarBrand>
      </S.NavbarBrand>
      <S.NavbarSocial>
        <UserTimezone />

        <Select
          options={options}
          value={themeMode}
          onChange={setThemeMode}
          isThemeMode
        />
        {socialLinks?.enabled && socialLinks.githubUrl && (
          <S.SocialLink href={socialLinks.githubUrl} target="_blank">
            <GitHubIcon />
          </S.SocialLink>
        )}
        {socialLinks?.enabled && socialLinks.discordUrl && (
          <S.SocialLink href={socialLinks.discordUrl} target="_blank">
            <DiscordIcon />
          </S.SocialLink>
        )}
        {socialLinks?.enabled && socialLinks.productHuntUrl && (
          <S.SocialLink href={socialLinks.productHuntUrl} target="_blank">
            <ProductHuntIcon />
          </S.SocialLink>
        )}
        <UserInfo />
      </S.NavbarSocial>
    </S.Navbar>
  );
};

export default NavBar;
