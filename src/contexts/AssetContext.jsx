import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getAssetSearchIndex,
  getAssetLastUpdate,
} from "../services/assetService";

const AssetContext = createContext();

export function AssetProvider({
  children,
}) {
  const [assetIndex, setAssetIndex] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const lastUpdateRef =
    useRef(null);

  // const loadSearchIndex =
  //   async () => {
  //     try {

  //       const data =
  //         await getAssetSearchIndex();

  //       setAssetIndex(data);

  //     } catch (error) {

  //       console.error(
  //         "loadSearchIndex",
  //         error
  //       );

  //     }
  //   };

  const loadSearchIndex =
    async () => {

      console.time(
        "loadSearchIndex"
      );

      try {

        const data =
          await getAssetSearchIndex();

        setAssetIndex(data);

      } finally {

        console.timeEnd(
          "loadSearchIndex"
        );

      }

    };

  const loadInitialData =
    async () => {

      try {

        setLoading(true);

        const updateInfo =
          await getAssetLastUpdate();

        lastUpdateRef.current =
          updateInfo.updated_at;

        await loadSearchIndex();

      } catch (error) {

        console.error(
          "loadInitialData",
          error
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {

    loadInitialData();

  }, []);

  // useEffect(() => {

  //   const timer =
  //     setInterval(async () => {

  //       try {
  //         console.log(
  //           "loadSearchIndex check update"
  //         );
  //         const result =
  //           await getAssetLastUpdate();

  //         if (
  //           result.updated_at !==
  //           lastUpdateRef.current
  //         ) {

  //           console.log(
  //             "Asset Index Updated"
  //           );

  //           lastUpdateRef.current =
  //             result.updated_at;

  //           await loadSearchIndex();

  //         }

  //       } catch (error) {

  //         console.error(
  //           "check update error",
  //           error
  //         );

  //       }

  //     }, 10000); // ทำงานทุก 60 วินาที (1 นาที)

  //   return () =>
  //     clearInterval(timer);

  // }, []);

  useEffect(() => {

    const CHECK_INTERVAL =
      5 * 60 * 1000; // 5 นาที

    const timer =
      setInterval(async () => {

        try {

          const result =
            await getAssetLastUpdate();

          if (
            result.updated_at !==
            lastUpdateRef.current
          ) {

            console.log(
              "Asset Index Updated"
            );

            lastUpdateRef.current =
              result.updated_at;

            await loadSearchIndex();

          }

        } catch (error) {

          console.error(
            "check update error",
            error
          );

        }

      }, CHECK_INTERVAL);

    return () =>
      clearInterval(timer);

  }, []);

  return (
    <AssetContext.Provider
      value={{
        assetIndex,
        loading,
        reloadSearchIndex:
          loadSearchIndex,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}

export const useAsset = () =>
  useContext(AssetContext);