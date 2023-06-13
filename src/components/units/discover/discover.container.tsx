// import Head from "next/head";
// import Script from "next/script";
// import { useEffect } from "react";

import GetLocation from "@/src/commons/utils/getLocation";
import { Box } from "@chakra-ui/react";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import CustomTabs from "../../commons/combine/customTabs";

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function DiscoverContainer() {
  const [category, setCategory] = useState("FD6");
  const location: any = GetLocation();

  useEffect(() => {
    const mapScript = document.createElement("script");

    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAPS_API}&autoload=false&libraries=services`;

    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.483034, 126.902435), // 0지도의 중심좌표

          // center: new window.kakao.maps.LatLng(
          //   location.latitude,
          //   location.longitude
          // ), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };
        var map = new window.kakao.maps.Map(mapContainer, mapOption);

        var ps = new kakao.maps.services.Places(map);

        // 카테고리로 은행을 검색합니다
        ps.categorySearch(category, placesSearchCB, { useMapBounds: true });

        // 키워드 검색 완료 시 호출되는 콜백함수 입니다
        function placesSearchCB(data, status, pagination) {
          if (status === kakao.maps.services.Status.OK) {
            for (var i = 0; i < data.length; i++) {
              displayMarker(data[i]);
            }
          }
        }

        // 지도에 마커를 표시하는 함수입니다
        function displayMarker(place) {
          // 마커를 생성하고 지도에 표시합니다
          var marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.y, place.x),
          });

          var infowindow = new kakao.maps.InfoWindow();

          // 마커에 클릭이벤트를 등록합니다
          kakao.maps.event.addListener(marker, "click", function () {
            // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
            infowindow.setContent(
              '<div style="padding:5px;font-size:12px;">' +
                place.place_name +
                "</div>"
            );
            infowindow.open(map, marker);
          });
        }
      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);
  }, [category]);

  const onClickTab = (tab: string) => {
    const searchCateogry = () => {
      switch (tab) {
        case "Restaurant":
          return "FD6";
        case "Cafe/Dessert":
          return "CE7";
        case "Salon/Beauty":
          return "CT1";
        case "Hospital/Pharmacy":
          return "HP8";
        case "Exercise":
          return "CT1";
        default:
          return "hi";
      }
    };
    setCategory(searchCateogry());
  };

  return (
    <>
      <CustomTabs
        categoryKindOptions="dicoverBigCategory"
        onClickTab={onClickTab}
      />
      <Box id="map" width="100%" h="calc(100vh - 8rem)" />
    </>
  );
}
