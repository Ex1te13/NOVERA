/**
 * Локальные копии фото, чтобы сайт не зависел от Unsplash.
 * Отдаются через оптимизатор Next: нужная ширина и WebP вместо исходного JPG 1800px.
 * Ширина должна входить в deviceSizes/imageSizes из next.config.
 */
const WIDTHS = [384, 640, 828, 1080, 1200, 1920] as const;

const fit = (w: number) => WIDTHS.find((s) => s >= w) ?? WIDTHS[WIDTHS.length - 1];

export const u = (id: string, w = 1200, _extra = "") => `/_next/image?url=${encodeURIComponent(`/photos/${id}.jpg`)}&w=${fit(w)}&q=72`;

/** srcSet для крупных фото, чтобы телефон не качал версию для большого экрана */
export const srcSet = (id: string, max = 1920) =>
  WIDTHS.filter((s) => s >= 640 && s <= max)
    .map((s) => `${u(id, s)} ${s}w`)
    .join(", ");

/** Дома (экстерьеры) */
export const HOUSES = {
  heroAFrame: "photo-1568605114967-8130f3a36994", // тёмный дом с треугольной кровлей, вечер, лес
  brickDusk: "photo-1449844908441-8829872d2607", // кирпичный дом в лесу на закате
  lakeHouse: "photo-1464146072230-91cabc968266", // дом у озера
  winterCabin: "photo-1510798831971-661eb04b3739", // деревянный дом, снег, озеро
  fieldSunset: "photo-1558036117-15d82a90b9b1", // дом в поле на закате
  greyFarm: "photo-1583608205776-bfd35f0d9f83", // серый современный дом с двускатной крышей
  redRoof: "photo-1576941089067-2de3c901e126", // дом с красной крышей
  woodModern: "photo-1600047509358-9dc75507daeb", // современный дом с деревом
  darkModern1: "photo-1600566753190-17f0baa2a6c3",
  darkModern2: "photo-1600585153490-76fb20a32601",
  darkModern3: "photo-1600585154363-67eb9e2e2099",
  darkSlats: "photo-1600585154526-990dced4db0d",
  whiteModern: "photo-1600585154340-be6161a56a0c",
  treeHouse1: "photo-1600607688960-e095ff83135c",
  treeHouse2: "photo-1600607688969-a5bfcd646154",
  brickRed: "photo-1628624747186-a941c476b7ef",
  entrance: "photo-1628744448840-55bdb2497bd4",
  poolVilla: "photo-1613977257363-707ba9348227",
  poolWhite: "photo-1600596542815-ffad4c1539a9",
  porchGrey: "photo-1599427303058-f04cbcf4756f",
  brickPorch: "photo-1572120360610-d971b9d7767c",
  lawnHouse: "photo-1592595896551-12b371d546d5",
  darkPatio: "photo-1600585154084-4e5fe7c39198",
  cabinDark: "photo-1449158743715-0a90ebb6d2d8",
  stone: "photo-1588880331179-bc9b93a8cb5e",
} as const;

/** Интерьеры */
export const INTERIORS = {
  greenLiving: "photo-1615873968403-89e068629265", // гостиная с тёмно-зелёной стеной
  blueFireplace: "photo-1615874694520-474822394e73",
  archLiving: "photo-1600210491892-03d54c0aaf87",
  livingSoft: "photo-1600210492486-724fe5c67fb0",
  darkKitchen: "photo-1600489000022-c2086d79f9d4",
  marbleKitchen: "photo-1600566752229-250ed79470f8",
  bathroom: "photo-1600566752355-35792bedcfea",
  bedroomWarm: "photo-1600566753051-f0b89df2dd90",
  livingBlue: "photo-1600566753086-00f18fb6b3ea",
  livingWoodTv: "photo-1600566753104-685f4f24cb4d",
  kitchenBright: "photo-1600573472592-401b489a3cdc",
  kitchenWhite: "photo-1600585152220-90363fe7e115",
  patioLiving: "photo-1600585152915-d208bec867a1",
  kitchenWood: "photo-1600607686527-6fb886090705",
  hall: "photo-1600607687126-8a3414349a51",
  livingView: "photo-1600607687644-c7171b42498f",
  glassWall: "photo-1600607687920-4e2a09cf159d",
  livingWood: "photo-1600607687939-ce8a6c25118c",
  bathWood: "photo-1600607688066-890987f18a86",
  diningLiving: "photo-1604014237800-1c9102c219da",
  bedroomLight: "photo-1609766857041-ed402ea8069a",
  livingWarm: "photo-1613545325278-f24b0cae1224",
  livingCalm: "photo-1615529182904-14819c35db37",
  darkBedroom: "photo-1617104678098-de229db51175",
  darkLiving: "photo-1618219740975-d40978bb7378",
  bedroomStaged: "photo-1616594039964-ae9021a400a0",
  livingStaged: "photo-1616137466211-f939a420be84",
  livingStaged2: "photo-1616486338812-3dadae4b4ace",
  livingStaged3: "photo-1617806118233-18e1de247200",
  kitchenGarden: "photo-1502005097973-6a7082348e28",
  stairs: "photo-1600047508788-786f3865b4b9",
  livingLight: "photo-1600121848594-d8644e57abab",
  livingWhite: "photo-1600210491369-e753d80a41f3",
  loftLiving: "photo-1567767292278-a4f21aa2d36e",
  bedroomHotel: "photo-1512918728675-ed5a9ecdebfd",
  bedroomGrey: "photo-1505691938895-1758d7feb511",
  bathroomWhite: "photo-1631889993959-41b4e9c6e3c5",
  tiles: "photo-1552321554-5fefe8c9ef14",
  bedroomSoft: "photo-1616627561950-9f746e330187",
  livingCozy: "photo-1618221195710-dd6b41faaea6",
  livingGreenChair: "photo-1618219908412-a29a1bb7b86e",
  bedroomDark2: "photo-1616046229478-9901c5536a45",
  livingNeutral: "photo-1616047006789-b7af5afb8c20",
  studyWarm: "photo-1615875605825-5eb9bb5d52ac",
} as const;

/** Участки, ландшафт, детали */
export const LAND = {
  forestPath: "photo-1441974231531-c6227db76b6e",
  forestDeep: "photo-1448375240586-882707db888b",
  riverForest: "photo-1473448912268-2022ce9509d8",
  hills: "photo-1470071459604-3b5ec3a7fe05",
  leaves: "photo-1470058869958-2a77ade41c02",
  birch: "photo-1518173946687-a4c8892bbd9f",
  gardenHouse: "photo-1557429287-b2e26467fc2b",
  lawn: "photo-1558904541-efa843a96f01",
  gardenBeds: "photo-1584479898061-15742e14f50d",
  gardenPath: "photo-1585320806297-9794b3e4eeae",
  lawnBuilding: "photo-1591123120675-6f7f1aae0e5b",
  garden: "photo-1598902108854-10e335adac99",
  planting: "photo-1416879595882-3373a0480b5b",
  porch: "photo-1560184897-ae75f418493e",
  sunsetPatio: "photo-1599809275671-b5942cabc7a2",
  pergola: "photo-1622015663319-e97e697503ee",
  blueprint: "photo-1512207736890-6ffed8a84e8d",
  plans: "photo-1603796846097-bee99e4a601f",
  work: "photo-1558618666-fcd25c85cd64",
  aerial: "photo-1516156008625-3a9d6067fab5",
} as const;
