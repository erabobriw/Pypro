import type { MapTour } from "@/components/kazakhstan-map";
import type { Stop, Tour } from "@/data/catalog";
import type { Lang } from "@/lib/lang";
import { tx } from "@/lib/lang";
import { formatKzt } from "@/lib/money";

function stopPhoto(tour: Tour, index: number, stop: Stop): string | undefined {
  const blob = `${stop.name.kk} ${stop.name.ru} ${stop.name.en}`.toLowerCase();
  if (/шарын|чарын|charyn/.test(blob)) return "/tours/charyn.jpg";
  if (/көлсай|кольсай|kolsai/.test(blob)) return "/tours/kolsai.jpg";
  if (/бозж|бозжыра|bozzhyra/.test(blob)) return "/tours/bozzhyra.jpg";
  if (/қайынды|каинды|kaindy/.test(blob)) return "/tours/kaindy.jpg";
  if (/бурабай|burabay/.test(blob)) return "/tours/burabay.jpg";
  if (/ақсу|аксу|aksu/.test(blob)) return "/tours/aksu.jpg";
  if (/құм|бархан|dune/.test(blob)) return "/tours/dune.jpg";
  if (/сауран|sauran|түркістан|туркестан|turkestan/.test(blob)) return "/tours/yasawi.jpg";
  if (/рахман|rakhman|белух|belukha|берел|berel|жота/.test(blob)) return "/tours/altai.jpg";
  if (/жайл|zhailau/.test(blob)) return "/tours/meadow.jpg";
  if (/алматы көл|алматинск|big almaty|үлкен алматы/.test(blob)) return "/tours/bal.jpg";
  if (index === tour.stops.length - 1) return tour.image;
  return undefined;
}

export function toMapTour(tour: Tour, lang: Lang): MapTour {
  const nights = tour.stops.filter((stop) => stop.night).length;
  return {
    id: tour.id,
    title: tx(tour.title, lang),
    priceLabel: formatKzt(tour.priceKzt),
    transport: tour.transport,
    position: tour.position,
    route: tour.route,
    days: tour.days,
    nights,
    includes: tour.includes.slice(0, 4).map((item) => tx(item, lang)),
    stops: tour.stops.map((stop, index) => ({
      name: tx(stop.name, lang),
      position: stop.position,
      night: stop.night,
      photo: stopPhoto(tour, index, stop),
    })),
  };
}
