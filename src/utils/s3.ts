const bucketUrl = "https://worldcupstack-teamcrestbucket54e9be2b-ns704b66xn74.s3.eu-west-2.amazonaws.com/"

export function getImageUrl(country: string): string {
    return `${bucketUrl}${getCountryCode(country)}.svg`
}

function getCountryCode(country: string): string {
    return country.toLowerCase().replace(" ", "-")
}

export function getFlagEmoji(country: string): string {
    const countryCode: string = getCountryCode(country)
    
    if (!FLAG_EMOJIS.has(countryCode)) return country

    const flagEmoji: string | undefined = FLAG_EMOJIS.get(countryCode)
    return flagEmoji ? flagEmoji : country
}

export const FLAG_EMOJIS: Map<string, string> = new Map([
    ["qatar", "🇶🇦"],
    ["ecuador", "🇪🇨"],
    ["england", "🏴󠁧󠁢󠁥󠁮󠁧󠁿"],
    ["iran", "🇮🇷"],
    ["usa", "🇺🇸"],
    ["wales", "🏴󠁧󠁢󠁷󠁬󠁳󠁿"],
    ["senegal", "🇸🇳"],
    ["netherlands", "🇳🇱"],
    ["argentina", "🇦🇷"],
    ["saudi-arabia", "🇸🇦"],
    ["denmark", "🇩🇰"],
    ["tunisia", "🇹🇳"],
    ["mexico", "🇲🇽"],
    ["poland", "🇵🇱"],
    ["france", "🇫🇷"],
    ["australia", "🇦🇺"],
    ["morocco", "🇲🇦"],
    ["croatia", "🇭🇷"],
    ["germany", "🇩🇪"],
    ["japan", "🇯🇵"],
    ["spain", "🇪🇸"],
    ["costa-rica", "🇨🇷"],
    ["belgium", "🇧🇪"],
    ["canada", "🇨🇦"],
    ["switzerland", "🇨🇭"],
    ["cameroon", "🇨🇲"],
    ["uruguay", "🇺🇾"],
    ["south-korea", "🇰🇷"],
    ["portugal", "🇵🇹"],
    ["ghana", "🇬🇭"],
    ["brazil", "🇧🇷"],
    ["serbia", "🇷🇸"]
])