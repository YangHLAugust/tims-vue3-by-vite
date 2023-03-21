import { InjectionKey, inject, UnwrapRef, Ref } from "vue";
type ShallowUnwrap<T> = {
  [P in keyof T]: UnwrapRef<T[P]>;
};
const key: InjectionKey<AppProviderContextProps> = Symbol();
export interface AppProviderContextProps {
  prefixCls: Ref<string>;
  isMobile: Ref<boolean>;
}
export function useContext<T>(key: InjectionKey<T>, native?: boolean): T;
export function useContext<T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue?: any
): ShallowUnwrap<T> {
  return inject(key, defaultValue || {});
}
export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key);
}
export function useDesign(scope: string) {
  const values = useAppProviderContext();

  return {
    prefixCls: `${values.prefixCls}-${scope}`,
    prefixVar: values.prefixCls,
  };
}
