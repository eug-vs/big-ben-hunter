import Button from "@/components/button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="paper mx-auto my-10 flex-1 prose text-lg">
      <h3>Basic rules</h3>
      <p>
        You mine BTC by flipping one of the 4 coins. <b>3 of the 4</b> coins are lucky.
        If you pick the lucky coin, your streak will increase and will be added to your BTC balance.
        If you pick the wrong coin, you will lose <b>50%</b> of your BTC balance and lose your streak (down to 0).
      </p>
      <p>
        Big Ben Hunter uses <b>provable fair & true random</b> - meaning you are fighting alone against your luck.
      </p>
      <h3>Map</h3>
      <p>
        Map is a 2D plane: balance is horizontal axis and streak is vertical.
        You can always find yourself on the map - your current BTC balance and streak are the coordinates.
        You can also see which path along the map you have travelled recently.
        You can see all players on the <Link href="/map">world map</Link>.
      </p>
      <div className="flex justify-center">
        <Link href="/play">
          <Button>
            Start mining
          </Button>
        </Link>
      </div>
      <h3>Planned features</h3>
      <h4>Economy</h4>
      <p>
        Main currency is HT (<i>Hunter Tokens</i>). You can exchange BTC {'->'} HT.
      </p>
      <p>
        HT is stable - unlike BTC, you can not lose it by chance. Use HT to buy goods on the <Link href="/shop">market</Link>.
        The more BTC you sell, the better exchange rate you get.
      </p>
      <h4>Treasures</h4>
      <p>
        Some points on the map have secret treasures.
        You can collect a treasure by visiting it&apos;s point (i.e having exact streak and balance of this point).
        There are different types of treasures:
        <ul>
          <li>Consumables</li>
          <li>Cosmetic items</li>
          <li>Special tools (e.g Treasure Radar)</li>
          <li>Lootboxes</li>
        </ul>
      </p>
      Some treasures are very rare and unique! Players can trade treasures {'<->'} HT on the market.
      <h4>Map control</h4>
      <p>
        Players can buy land on the map for HT. The land is not cheap! When the player owns some region of the map, each player who
        enters this area must pay a fee to the landlord.
      </p>
    </section>
  );
}
