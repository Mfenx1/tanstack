import { useCallback } from 'react';
import { Bell, Globe, Mail, Search, SlidersVertical } from 'lucide-react';
import { ICON_COLOR_LIGHT } from '$constants';
import { useAuth } from '$context';
import { selectSearch, setSearch } from '$store';
import { useDispatch, useSelector } from 'react-redux';
import classes from './ProductsHeader.module.css';

export const ProductsHeader = () => {
  const { logout } = useAuth();
  const search = useSelector(selectSearch);
  const dispatch = useDispatch();
  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => dispatch(setSearch(event.target.value)),
    [dispatch]
  );

  return (
    <header className={classes.header}>
      <div className={classes.headerRow}>
        <h1 className={classes.title}>Товары</h1>
        <div className={classes.headerIcons}>
          <div className={classes.searchWrap}>
            <Search className={classes.searchIcon} size={20} />
            <input
              type="search"
              placeholder="Найти"
              value={search}
              onChange={onSearchChange}
              className={classes.search}
            />
          </div>
          <div className={classes.divider} aria-hidden />
          <div className={classes.iconsGroup}>
            <Globe size={20} color={ICON_COLOR_LIGHT} />
            <Bell size={20} color={ICON_COLOR_LIGHT} />
            <Mail size={20} color={ICON_COLOR_LIGHT} />
            <SlidersVertical size={20} color={ICON_COLOR_LIGHT} />
          </div>
          <div className={classes.user}>
            <button type="button" onClick={logout} className={classes.logout}>
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
