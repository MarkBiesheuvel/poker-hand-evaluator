const Poker_Card = require('./Card');

/**
 * Comparison function for usage in sort
 *
 * @param {*} a First item
 * @param {*} b Second item
 * @returns {Number} Iff a < b returns a positve number, iff b < a returns negative, otherwise zero
 */
const descending = (a, b) => {
    if (a > b) {
        return -1;
    } else if (a < b) {
        return 1;
    } else {
        return 0;
    }
};

/**
 * A hand of poker
 * This includes an array of cards an a ranking system
 */
class Poker_Hand {

    /**
     *
     * @param {Array} cards An array of cards
     * @param {Poker_Ranking} ranker A ranking system
     */
    constructor(cards, ranker) {

        if (cards.length !== ranker.numberOfCardsInHand) {
            throw new Error(`Hand must contain exactly ${ranker.numberOfCardsInHand} cards`);
        }

        // Convert to Card objects if that hasn't been done
        cards = cards.map((card) => {
            if (typeof card === 'string') {
                return new Poker_Card(card, ranker.valuator);
            } else {
                return card;
            }
        });

        // Check for duplicates
        for (let i = 0; i < cards.length; i++) {
            for (let j = 0; j < cards.length; j++) {

                if (i === j) {
                    continue;
                }

                if (cards[i].rank === cards[j].rank && cards[i].suit === cards[j].suit) {
                    throw new Error(`Duplicate cards: ${cards[i].toString()}`);
                }

            }
        }

        this.cards = cards;
        this.strength = ranker.getStrength(this);
    }

    /**
     * @returns {void}
     */
    sort() {
        // Order cards from high to low
        this.cards = this.cards.sort(descending);
    }

    /**
     *
     * @returns {Array} An array containing cards grouped by rank
     */
    getGroupedCards() {

        const cards = this.cards;

        // Create a temporary object in which card witht he same rank are put into the same array
        let tmp = {};
        for (let i = 0; i < 5; i++) {
            let card = cards[i];
            if (!(card.rank in tmp)) {
                tmp[card.rank] = [];
            }

            tmp[card.rank].push(card);
        }

        // Now transform this object of arrays into and array of objects
        let grouped = [];
        for (let rank in tmp) {
            grouped.push({
                rank: rank,
                cards: tmp[rank]
            });
        }

        // Sort the groups of cards based on a big the group is; larger groups to lower groups
        // If groups are even large, sort on the rank of the cards;higher cards to lower cards
        grouped.sort((a, b) => {
            let comp = descending(a.cards.length, b.cards.length);
            if (comp !== 0) {
                return comp;
            } else {
                return descending(a.cards[0].valueOf(), b.cards[0].valueOf());
            }
        });

        return grouped;
    }

    /**
     *
     * @returns {boolean} Whether this hand contains cards of only one suit
     */
    isFlush() {

        let cards = this.cards;

        return cards[0].suit == cards[1].suit &&
            cards[1].suit == cards[2].suit &&
            cards[2].suit == cards[3].suit &&
            cards[3].suit == cards[4].suit;
    }

    /**
     *
     * @returns {boolean} Whether this hand contains cards in sequential order
     */
    isStraight() {

        let cards = this.cards;

        return cards[0].valueOf() == (cards[1].valueOf() + 1) &&
            cards[1].valueOf() == (cards[2].valueOf() + 1) &&
            cards[2].valueOf() == (cards[3].valueOf() + 1) &&
            cards[3].valueOf() == (cards[4].valueOf() + 1);
    }

    /**
     *
     * @returns {string} Short description of hand strength
     */
    getShortName() {
        return this.strength.getShortName();
    }

    /**
     *
     * @returns {string} Long description of hand strength
     */
    getLongName() {
        return this.strength.getLongName();
    }

    /**
     *
     * @returns {Number} Value of hand strength
     */
    valueOf() {
        return this.strength.valueOf();
    }
}

module.exports = Poker_Hand;



