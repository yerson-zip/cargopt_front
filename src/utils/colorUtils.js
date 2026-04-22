import { PALETTE } from "../constants/palette";

export function hashColor(str) {
  let h = 0;
  for (let c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return PALETTE[h % PALETTE.length];
}

export function mapItem(item) {
  return {
    id:     item.id,
    nombre: item.nombre,
    x:      item.pos_x,
    y:      item.pos_y,
    z:      item.pos_z,
    largo:  item.largo,
    alto:   item.alto,
    ancho:  item.ancho,
    peso:   item.peso,
    color:  hashColor(item.nombre),
  };
}