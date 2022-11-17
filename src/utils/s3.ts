const bucketUrl = 'https://worldcupstack-teamcrestbucket54e9be2b-ns704b66xn74.s3.eu-west-2.amazonaws.com/'

export function getImageUrl(country: string) {
    return bucketUrl + country.toLowerCase().replace(' ', '-') + '.svg'
}