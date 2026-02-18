'use client';

type KakaoMapProps = {
  address: string;
  placeName?: string;
};

export default function KakaoMap({ address, placeName }: KakaoMapProps) {
  if (!address.trim()) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
        주소를 입력하면 지도가 표시됩니다.
      </div>
    );
  }

  const mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(address)}`;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex h-40 flex-col items-center justify-center gap-2 bg-slate-50 p-4 text-center">
        <p className="text-sm font-semibold text-slate-700">{placeName || '행사 장소'}</p>
        <p className="text-xs text-slate-500">{address}</p>
      </div>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-yellow-400 py-2 text-center text-sm font-medium text-slate-900 transition hover:bg-yellow-500"
      >
        🗺️ 카카오맵에서 길찾기
      </a>
    </div>
  );
}
