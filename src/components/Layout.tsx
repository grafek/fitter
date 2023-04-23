import Link from "next/link";
import SearchBar from "./SearchBar";
import { Navigation, SlideToTop } from "./UI";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div id="overlays" />
      <div className="min-h-screen dark:bg-[#21262d] dark:text-[#c9d1d9]">
        <header className="fixed z-[80] w-full select-none bg-[#f6f8fa] px-3 py-2 opacity-90 shadow-sm shadow-blue-400 dark:bg-[#161b22] dark:shadow-blue-800">
          <div className="container mx-auto flex items-center justify-between ">
            <Link
              href={"/"}
              shallow={true}
              className="flex items-center justify-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="48"
                fill="#3366ff"
                version="1.1"
                viewBox="0 0 422.263 422.263"
              >
                <path d="M416.263 307.135h-40v-28.316a6 6 0 00-6-6h-22v-23.688a6 6 0 00-6-6h-56a6 6 0 00-6 6v58.003h-50.348a40.375 40.375 0 001.573-2.229c13.406-20.492 20.492-44.312 20.492-68.884 0-26.382-8.047-51.522-23.253-72.895V96.111c0-47.96-39.019-86.979-86.979-86.979h-31.203c-48.132 0-87.291 39.158-87.291 87.291v66.683a127.426 127.426 0 00-3.898 5.786C6.693 188.963 0 212.176 0 236.022c0 24.573 7.086 48.393 20.492 68.884a40.22 40.22 0 001.581 2.239 5.996 5.996 0 00-5.809 5.99v24a6 6 0 006 6h40v34.309a6 6 0 006 6h22v23.688a6 6 0 006 6h56a6 6 0 006-6v-63.997h122v63.997a6 6 0 006 6h56a6 6 0 006-6v-23.688h22a6 6 0 006-6v-34.309h40a6 6 0 006-6v-24a6.002 6.002 0 00-6.001-6zM74.761 120.908a42.238 42.238 0 01-4.634-19.272c0-23.435 19.125-42.5 42.633-42.5h26.464c11.472 0 22.177 4.388 30.145 12.356 8.053 8.053 12.488 18.712 12.488 30.012a42.417 42.417 0 01-4.664 19.394c-16.114-7.205-33.309-10.866-51.204-10.866-17.906-.001-35.111 3.665-51.228 10.876zm118.834-24.773h23.131v52.511a126.836 126.836 0 00-28.819-22.347 54.376 54.376 0 005.95-24.796c0-1.804-.088-3.595-.262-5.368zm-83.051-75.003h31.203c37.267 0 68.26 27.334 74.011 63.003h-24.752c-2.651-7.857-7.096-15.073-13.152-21.129-10.234-10.234-23.954-15.871-38.63-15.871H112.76c-23.988 0-44.4 15.51-51.727 37H36.272c5.886-35.689 36.942-63.003 74.272-63.003zm-75.291 75.29c0-.096.007-.191.007-.287h23.144a54.636 54.636 0 00-.278 5.5 54.191 54.191 0 005.925 24.683 126.15 126.15 0 00-28.798 22.29V96.422zm-6.99 234.713v-12h34v12h-34zm46 40.309v-86.625h16v86.625h-16zm28-116.312h16v146h-16v-146zm44 146h-16v-146h16v146zm-50-158a6 6 0 00-6 6v23.688h-22a6 6 0 00-6 6v28.316H39.809c-3.674-2.102-6.867-5.116-9.276-8.798C18.409 279.803 12 258.255 12 236.022c0-43.473 24.164-82.554 63.068-101.997 15.878-7.958 33.011-11.994 50.921-11.994 17.902 0 35.028 4.032 50.911 11.989 15.965 7.968 30.039 19.782 40.701 34.167 14.64 19.731 22.378 43.188 22.378 67.835 0 22.233-6.409 43.781-18.534 62.315-2.414 3.691-5.616 6.709-9.273 8.798h-53.91v-58.003a6 6 0 00-6-6H96.263zm62 88.003v-12h122v12h-122zm134-76.003h16v146h-16v-146zm44 146h-16v-146h16v146zm28-29.688h-16v-86.625h16v86.625zm46-40.309h-34v-12h34v12z"></path>
              </svg>
              <p className="bg-gradient-to-r from-indigo-700 to-indigo-400 bg-clip-text text-xl font-medium tracking-wide text-transparent dark:from-indigo-100 dark:to-indigo-300">
                Fitter
              </p>
            </Link>
            <SearchBar />
            <Navigation />
          </div>
        </header>
        <main className="container mx-auto min-h-screen max-w-5xl px-2 pb-6 pt-20">
          {children}
        </main>
        <footer
          className={`flex h-12 items-center justify-center bg-[#f6f8fa] dark:bg-[#161b22]/70`}
        >
          <a
            href="https://github.com/grafek"
            target={"_blank"}
            rel="noreferrer"
          >
            ©{new Date().getFullYear()} Jacek Grafender
          </a>
        </footer>
      </div>
      <SlideToTop />
    </>
  );
};

export default Layout;
