import { PageWrapper } from './Wrappers';
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion"
import { PAGES_CONFIG } from './pages';
import { StakingMetricsContextWrapper } from './contexts/Staking';

export const Router = () => {

  return (
    <StakingMetricsContextWrapper>
      <AnimatePresence>
        <Routes>
          {PAGES_CONFIG.map((page, pageIndex) => {

            const { Entry } = page;

            return (
              <Route
                key={`main_interface_page_${pageIndex}`}
                path={page.uri}
                element={

                  <PageWrapper
                    key={`main_interface_key__${pageIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      duration: 0.8,
                      type: "spring",
                      bounce: 0.4
                    }}
                  >
                    <Entry page={page} />
                  </PageWrapper>
                }
              />
            );
          })}
        </Routes>
      </AnimatePresence>
    </StakingMetricsContextWrapper>
  );
}

export default Router;