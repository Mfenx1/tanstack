import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isOk, queryKeys } from '$lib';
import { addProduct } from '$services';
import type { Product, ProductAddPayload, ProductsResponse } from '$types';
import { generateClientKey, generateTempId } from '$utils';

export const useAddProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ProductAddPayload) => {
      const res = await addProduct(payload);
      if (!isOk(res)) throw new Error(res.error.message);
      return res.data;
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });

      const previousData = queryClient.getQueriesData<InfiniteData<ProductsResponse>>({
        queryKey: ['products', 'list'],
      });

      const tempId = generateTempId();
      const clientKey = generateClientKey();
      const tempProduct: Product = {
        id: tempId,
        _clientKey: clientKey,
        title: payload.title,
        price: payload.price,
        brand: payload.brand,
        sku: payload.sku,
        rating: 0,
        category: 'uncategorized',
      };

      queryClient.setQueriesData<InfiniteData<ProductsResponse>>(
        { queryKey: ['products', 'list'] },
        (old) => {
          if (!old?.pages.length) return old;
          const first = old.pages[0];
          if (!first) return old;
          const rest = old.pages.slice(1);
          const updated: ProductsResponse = {
            ...first,
            products: [tempProduct, ...first.products],
            total: first.total + 1,
          };
          return { ...old, pages: [updated, ...rest] };
        }
      );

      return { previousData, tempId, clientKey };
    },
    onSuccess: (savedProduct, payload, context) => {
      const tempId = context?.tempId;
      const clientKey = context?.clientKey;
      if (tempId == null) return;
      const mergedProduct: Product = {
        ...savedProduct,
        _clientKey: clientKey,
        title: payload.title,
        brand: payload.brand,
        sku: payload.sku,
        price: payload.price,
      };
      queryClient.setQueriesData<InfiniteData<ProductsResponse>>(
        { queryKey: ['products', 'list'] },
        (old) => {
          if (!old?.pages.length) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              products: page.products.map((product) =>
                product.id === tempId ? mergedProduct : product
              ),
            })),
          };
        }
      );
    },
    onError: (_err, _payload, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
};
