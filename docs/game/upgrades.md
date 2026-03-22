# Upgrades & Items

Pickups spawn on the map and drop from defeated players. They can turn the tide of a fight.

## Powerup Boxes

These spawn randomly around the map:

<div class="item-row">
  <div class="item-box">
    <div class="item-sprite item-shield"></div>
    <div class="item-info">
      <strong>Shield</strong>
      <p>Temporary invulnerability. You glow and can't take damage for a few seconds.</p>
    </div>
  </div>
  <div class="item-box">
    <div class="item-sprite item-inferno"></div>
    <div class="item-info">
      <strong>Inferno</strong>
      <p>Your missiles become triple-shot for a limited time — massive firepower boost.</p>
    </div>
  </div>
</div>

## Upgrades

Upgrades drop when you kill a player who has enough score. Collect the box to earn an upgrade point.

There are 4 upgrade types, each with 5 levels (5% boost per level):

| Key | Type | Effect |
|-----|------|--------|
| `1` | **Speed** | Increases movement speed |
| `2` | **Defense** | Reduces damage taken |
| `3` | **Energy** | Faster energy regeneration |
| `4` | **Missile** | Increases missile damage |

Press the corresponding number key to apply an upgrade point when you have one available. Press `X` to drop an upgrade box for a teammate.

::: tip
In most modes, you lose your upgrades when you die. Choose wisely — stacking one stat is often better than spreading thin.
:::

## Upgrade Fever

When Upgrade Fever is active on a server, all players spawn with maximum upgrades. Upgrade boxes still spawn but have no additional effect.

<style>
.item-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
}

@media (max-width: 640px) {
  .item-row {
    grid-template-columns: 1fr;
  }
}

.item-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.item-sprite {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  background-image: url('/assets/items.png');
  background-repeat: no-repeat;
  background-size: 512px auto;
  image-rendering: auto;
  filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.4));
}

.item-shield {
  background-position: -70px -134px;
  background-size: 512px auto;
}

.item-inferno {
  background-position: -138px -134px;
  background-size: 512px auto;
}

.item-info strong {
  display: block;
  margin-bottom: 4px;
}

.item-info p {
  margin: 0 !important;
  font-size: 0.85rem;
  opacity: 0.8;
}
</style>
