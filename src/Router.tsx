import { PageWrapper } from './Wrappers';
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion"
import { PAGES_CONFIG } from './pages';

export const Router = () => {

  return (
    <AnimatePresence>
      <Routes>
        {PAGES_CONFIG.map((page, pageIndex) =>
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
                <h1>{page.title}</h1>
              </PageWrapper>
            } />
        )}
      </Routes>
    </AnimatePresence>
  );
}

export default Router;