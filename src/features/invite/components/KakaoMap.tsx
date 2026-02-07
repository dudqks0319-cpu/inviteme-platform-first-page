"use client";

import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        kakao: any;
    }
}

type KakaoMapProps = {
    address: string;
    placeName?: string;
};

export default function KakaoMap({ address, placeName }: KakaoMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if Kakao SDK is loaded
        const checkKakao = () => {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    setIsLoaded(true);
                });
            } else {
                // Retry after a short delay
                setTimeout(checkKakao, 100);
            }
        };
        checkKakao();
    }, []);

    useEffect(() => {
        if (!isLoaded || !mapRef.current || !address) return;

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result: any[], status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                const map = new window.kakao.maps.Map(mapRef.current, {
                    center: coords,
                    level: 3,
                });

                const marker = new window.kakao.maps.Marker({
                    map: map,
                    position: coords,
                });

                if (placeName) {
                    // XSS 방지: HTML 이스케이프
                    const escapeHtml = (text: string): string => {
                        const div = document.createElement('div');
                        div.textContent = text;
                        return div.innerHTML;
                    };

                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;font-size:12px;font-weight:500;">${escapeHtml(placeName)}</div>`,
                    });
                    infowindow.open(map, marker);
                }
            } else {
                setError("주소를 찾을 수 없습니다");
            }
        });
    }, [isLoaded, address, placeName]);

    if (error) {
        return (
            <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
                {error}
            </div>
        );
    }

    if (!address) {
        return (
            <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
                주소를 입력하면 지도가 표시됩니다
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200">
            <div ref={mapRef} className="h-48 w-full" />
            <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-yellow-400 py-2 text-center text-sm font-medium text-slate-900 hover:bg-yellow-500"
            >
                🗺️ 카카오맵에서 길찾기
            </a>
        </div>
    );
}
