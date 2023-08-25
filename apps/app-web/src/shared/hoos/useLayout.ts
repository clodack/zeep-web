import { useEffect, useState } from 'react';
import { useGlobalContext } from '../contexts/globalContext';
import { getIsMobile, getIsTablet } from 'zeep-sdk-core/src';

export type Layout = undefined | 'mobile' | 'tablet' | 'desktop';

export function useLayout() {
  const { sdk } = useGlobalContext();

	const [state, setState] = useState<Layout>(undefined);

	useEffect(() => {
		if (!sdk) return;

		const isMobile = getIsMobile(sdk);
		const isTablet = getIsTablet(sdk);

		function check(): void {
			if (isMobile.get()) {
				setState('mobile');
				return;
			}
			if (isTablet.get()) {
				setState('tablet');
				return;
			}
			setState('desktop');
		}

		isMobile.value$.subscribe(check);
		isTablet.value$.subscribe(check);
	}, [sdk]);

	return state;
}
