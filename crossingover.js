/*
    [TR] Rastgele string oluşturma package ı eklenir.
*/
var randomstring = require('random-string-gen')
/*
    [TR] iterasyon sayısı, popülasyon sayısı, crossing over 
    oranı, mutasyon oranı ve bit sayısı const olarak 
    başlangıçta değiştirilebilir bir şekilde belirlenir.
*/
const iterationNumber = 50
const populationNumber = 10
const crossingOverRatio = 0.7
const mutationRatio = 0.01
const bitSize = 6

/*
    [TR] Rastgele array oluşturma fonksiyonu
    -----------------------------------
    [TR] Bu fonksiyon aracılığıyla rastgele binary arrayler oluşturulur.
*/
function randomizeArrays(populationNumber) {
    let populations = []

    for (let i = 0; i < populationNumber; i++) {
        let randomBinaryNumber = randomstring({
            length: 6,
            type: 'binary',
        })

        if (parseInt(randomBinaryNumber, 2) > 36) {
            i -= 1
            continue
        }

        populations.push(randomBinaryNumber)
        //console.log(parseInt(populations[i], 2));
    }
    return populations
}

/*
    [TR] Fitness skoru hesaplama fonksiyonu
    -----------------------------------
    [TR] Bu fonksiyon aracılığıyla o an elimizde olan üye grubunun 
    uygunluk skoru hesaplanır ve en yüksek skora ulaşıldıysa kaydedilir.
*/
function calculateFitnessScores(arr, populationNumber, bestFit) {
    let fitnessScore = 0
    let tempNumber

    for (let i = 0; i < populationNumber; i++) {
        tempNumber =
            (36 * parseInt(arr[i], 2) + 20) /
            (parseInt(arr[i], 2) * parseInt(arr[i], 2) + 2)
        if (tempNumber > bestFit.bestFitnessScoredNumber) {
            bestFit.bestFitNumber = parseInt(arr[i], 2)
            bestFit.bestFitnessScoredNumber = tempNumber
        }
        fitnessScore += tempNumber
    }

    if (fitnessScore > bestFit.bestFitnessScore) {
        bestFit.bestFitnessScore = fitnessScore
        bestFit.bestFitnessArray = arr
    }

    return bestFit
}

/*
    [TR] Crossing over (çaprazlama) fonksiyonu
    -----------------------------------
    [TR] Bu fonksiyon sayesinde rulet metoduyla belirlenen rastgele üyeler
    yine rastgele belirlenmiş tek noktalı çaprazlama metoduyla çaprazlanır
    ve yeni üyeler oluşur.
*/
function crossingOver(arr, crossingOverRatio, bitSize) {
    /*
        [TR] gerekli hesaplamalar için değişkenler tanımlanır ve kaç adet 
        çaprazlama yapılacağı, çaprazlamanın başlayacağı bitin hangisi 
        olacağı belirlenir.
    */
    let arrSum = 0
    let arrRouletteRatio = []
    let randomMembers = []
    let arrRouletteRatioSum = 0
    let randomCrossPoint = Math.floor(Math.random() * bitSize + 1)

    if (randomCrossPoint == 0 || randomCrossPoint == bitSize) {
        randomCrossPoint = bitSize / 2
    }

    let crossingOverNumber = Math.round(arr.length * crossingOverRatio)

    if (crossingOverNumber % 2 == 1) {
        crossingOverNumber += 1
    }

    arr.forEach((element) => {
        arrSum += parseInt(element, 2)
    })

    let rouletteRatio = 100 / arrSum

    /*
        [TR] Üyelerin sayılarının büyüklüklerine göre yüzdelik oranlarının 
        belirlendiği coding işlemi yapılır. Burada üyelerin hangi aralıklarda 
        yer alacağı belirlenir. Örneğin 1 - 2 - 3 - 4 - 5 sayıları yaklaşık 
        %6.66 - %13.32 - %19,98 - %26,64 - %33,3 yüzdelik oranlarına sahip olur.
    */
    for (let i = 0; i < arr.length; i++) {
        let memberChance = parseInt(parseInt(arr[i], 2) * rouletteRatio)
        if (memberChance == 0) {
            memberChance = 1
        }
        arrRouletteRatio.push(arrRouletteRatioSum + memberChance)
        arrRouletteRatioSum += memberChance
    }

    /*
        [TR] Oluşturulan rulet oranlarına göre rastgele sayılar seçilerek 
        hangi üyelerin seçileceği kararlaştırılır ve randomMembers arrayine 
        eklenir.
    */
    for (let i = 0; i < crossingOverNumber; i++) {
        let randomNumber = Math.floor(Math.random() * 101)
        for (let j = 0; j < arr.length; j++) {
            if (
                (randomNumber < arrRouletteRatio[j + 1] &&
                    randomNumber > arrRouletteRatio[j] &&
                    j < arr.length - 1) ||
                randomNumber == arrRouletteRatio[j]
            ) {
                randomMembers.push(j)
                break
            } else if (
                j == arr.length - 1 &&
                randomNumber >= arrRouletteRatio[arr.length - 1]
            ) {
                randomMembers.push(arr.length - 1)
                break
            } else if (
                j == arr.length - 1 &&
                randomNumber < arrRouletteRatio[0]
            ) {
                randomMembers.push(0)
                break
            }
        }
    }

    /*
        [TR] Çaprazlama için seçilmiş üyeler karşılıklı olarak seçilir.
        ve çaprazlama işlemi gerçekleşir. Örneğin 0,1,2,3 numaralı 
        üyeler için 0-3 ve 1-2 çarpazlaması yapılır.
    */
    for (let i = 0; i < randomMembers.length / 2; i++) {
        let temp = arr[randomMembers[i]].substring(randomCrossPoint)
        let temp2 =
            arr[randomMembers[randomMembers.length - i - 1]].substring(
                randomCrossPoint
            )

        let tempBeginning = arr[randomMembers[i]].substring(0, randomCrossPoint)
        let temp2Beginning = arr[
            randomMembers[randomMembers.length - i - 1]
        ].substring(0, randomCrossPoint)

        arr[randomMembers[i]] = tempBeginning + temp2
        arr[randomMembers[randomMembers.length - i - 1]] = temp2Beginning + temp
    }
    return arr
}

/*
    [TR] Mutation (mutasyon) fonksiyonu
    -----------------------------------
    [TR] Bu fonksiyon sayesinde mutasyon oranına göre rastgele üyelerin
    rastgele bitleri mutasyon geçirir.
*/
function mutation(arr, mutationRatio, bitSize) {
    /*
        [TR] Mutasyon yapılacak üye sayısı hesaplanır.
    */
    let mutationSize = Math.round(bitSize * mutationRatio * arr.length)

    if (mutationSize == 0) {
        mutationSize += 1
    }

    for (let i = 0; i < mutationSize; i++) {
        /*
            [TR] Mutasyona uğrayacak üyeler ve bit sayısı belirlenir.
        */
        let mutatedMember = Math.floor(Math.random() * arr.length)

        let randomBitNumber = Math.floor(Math.random() * bitSize)

        /*
            [TR] Mutasyon işlemi olarak eğer 0 ise 1 yap, eğer 1 ise 
            0 yap işlemi gerçekleşir.
        */
        if (arr[mutatedMember].charAt(randomBitNumber) == '0') {
            arr[mutatedMember] =
                arr[mutatedMember].substring(0, randomBitNumber) +
                '1' +
                arr[mutatedMember].substring(randomBitNumber + 1)
        } else {
            arr[mutatedMember] =
                arr[mutatedMember].substring(0, randomBitNumber) +
                '0' +
                arr[mutatedMember].substring(randomBitNumber + 1)
        }
    }

    return arr
}

function main() {
    let bestFit = {
        bestFitnessScore: 0,
        bestFitnessArray: [],
        bestFitnessScoredNumber: 0,
        bestFitNumber: 0,
    }

    /*
        [TR] İlk olarak rastgele üyeler oluşturulur ve fitness 
        skoru hesaplanır.
    */
    let arr = randomizeArrays(populationNumber)
    bestFit = calculateFitnessScores(arr, populationNumber, bestFit)
    console.log('1. Fitness Sonucu\n' + '----------------------------------')
    console.log(bestFit)
    console.log('\n\n')

    /*
        [TR] Üyeler crossing-over ve mutasyon geçirerek iterasyon 
        sayısına göre hesaplanmaya devam eder.
    */
    for (let i = 0; i < iterationNumber - 1; i++) {
        arr = crossingOver(arr, crossingOverRatio, bitSize)
        arr = mutation(arr, mutationRatio, bitSize)
        bestFit = calculateFitnessScores(arr, populationNumber, bestFit)
        console.log(
            i + 2 + '. Fitness Sonucu\n' + '----------------------------------'
        )
        console.log(bestFit)
        console.log('\n\n')
    }
}

main()
