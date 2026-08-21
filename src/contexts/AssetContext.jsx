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
  const [assetIndex, setAssetIndex] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchIndexLoading, setSearchIndexLoading] = useState(false);

  const lastUpdateRef = useRef(null);

  // const loadSearchIndex =
  //   async () => {

  //     console.time(
  //       "loadSearchIndex"
  //     );

  //     try {

  //       const data =
  //         await getAssetSearchIndex();

  //       console.log(
  //         "getAssetSearchIndex result",
  //         data[0]
  //       );

  //       setAssetIndex(data);

  //     } finally {

  //       console.timeEnd(
  //         "loadSearchIndex"
  //       );

  //     }

  //   };

  // const loadSearchIndex =
  //   async () => {

  //     // console.time(
  //     //   "loadSearchIndex"
  //     // );

  //     try {

  //       const data =
  //         await getAssetSearchIndex();

  //       setAssetIndex(data);

  //       return data;

  //     } finally {

  //       // console.timeEnd(
  //       //   "loadSearchIndex"
  //       // );

  //     }

  //   };
  // const loadSearchIndex =
  //   async () => {

  //     try {

  //       setSearchIndexLoading(true);
  //       const data = await getAssetSearchIndex();

  //       setAssetIndex(data);

  //       return data;

  //     } finally {
  //       setSearchIndexLoading(false);
  //     }

  //   };
  const loadSearchIndex = async () => {
    try {
      setAssetIndex([]);
      setSearchIndexLoading(true);

      const data =
        await getAssetSearchIndex();

      setAssetIndex(data);

      return data;

    } finally {

      setSearchIndexLoading(false);

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

        //  เอาออกไปก่อนเพื่อไม่หน้าแรกโหลดช้า
        // await loadSearchIndex();

      } catch (error) {

        console.error(
          "loadInitialData",
          error
        );

      } finally {

        setLoading(false);

        // โหลด Search Index หลัง Dashboard แสดงผลแล้ว
        // setTimeout(() => {
        //   loadSearchIndex();
        // }, 500);

        loadSearchIndex();

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

            // console.log(
            //   "Asset Index Updated"
            // );

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
        reloadSearchIndex: loadSearchIndex,
        searchIndexLoading
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}

export const useAsset = () =>
  useContext(AssetContext);