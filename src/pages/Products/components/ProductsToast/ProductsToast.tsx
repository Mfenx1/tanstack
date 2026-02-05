import { useCallback } from 'react';
import { Toast } from '$components';
import { selectToast, setToast } from '$store';
import { useDispatch, useSelector } from 'react-redux';

export const ProductsToast = () => {
  const toast = useSelector(selectToast);
  const dispatch = useDispatch();
  const onToastClose = useCallback(() => dispatch(setToast(null)), [dispatch]);
  if (!toast) return null;
  return <Toast message={toast} onClose={onToastClose} />;
};
