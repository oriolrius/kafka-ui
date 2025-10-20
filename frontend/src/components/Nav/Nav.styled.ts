import styled from 'styled-components';
import { ClusterColorKey } from 'theme/theme';

export const NavContainer = styled.aside`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const List = styled.ul.attrs({ role: 'menu' })`
  & > & {
    padding: 0 0 0 8px;
  }

  & * {
    margin-bottom: 2px;
  }
`;

export const ClusterList = styled.ul.attrs<{ $colorKey: ClusterColorKey }>({
  role: 'menu',
})`
  border-radius: 8px;
  padding: 2px 4px;
  margin-bottom: 2px;
  background-color: ${({ theme, $colorKey }) =>
    theme.clusterMenu.backgroundColor[$colorKey]};
`;

export const UserMenuWrapper = styled.div`
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.menu.secondary.backgroundColor.hover};
`;

export const UserMenuItem = styled.a`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.menu.secondary.fontWeight};
  min-height: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 17px;
  user-select: none;
  width: 100%;
  padding: 8px 12px;
  cursor: pointer;
  text-decoration: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.menu.secondary.backgroundColor.normal};
  color: ${({ theme }) => theme.menu.secondary.color.normal};
  margin-bottom: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.menu.secondary.backgroundColor.hover};
    color: ${({ theme }) => theme.menu.secondary.color.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.menu.secondary.backgroundColor.active};
    color: ${({ theme }) => theme.menu.secondary.color.active};
  }

  svg path {
    fill: currentColor;
  }
`;
