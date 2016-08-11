#!/usr/bin/env node

const fs = require('fs')
const Iconv = require('iconv').Iconv
const download = require('download')
const path = require('path')
const Promise = require('promise')
const zlib = require('zlib')

const root = path.join(path.dirname(process.argv[1]), '..')
const converter = new Iconv('EUC-JP', 'UTF-8')

const okuriTable = {
    a: ['あ'],
    i: ['い'],
    u: ['う'],
    e: ['え'],
    o: ['お'],
    k: ['か', 'き', 'く', 'け', 'こ'],
    g: ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
    s: ['さ', 'し', 'す', 'せ', 'そ'],
    z: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
    t: ['た', 'ち', 'つ', 'て', 'と', 'った', 'っち', 'っつ', 'って', 'っと'],
    d: ['だ', 'ぢ', 'づ', 'で', 'ど'],
    n: ['な', 'に', 'ぬ', 'ね', 'の', 'ん'],
    h: ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    b: ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
    p: ['ぽ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
    m: ['ま', 'み', 'む', 'め', 'も'],
    y: ['や', 'ゆ', 'よ'],
    r: ['ら', 'り', 'る', 'れ', 'ろ'],
    w: ['わ', 'を']
}

const dictTable = {}

const register = function(yomi, kanji) {
    const yomiArray = Array.from(yomi)
    let singleYomi = null
    let target = dictTable
    while(yomiArray.length > 0) {
        singleYomi = yomiArray.shift()
        if (!target[singleYomi]) { target[singleYomi] = {} }
        target = target[singleYomi]
    }
    if(!target.w) {
        target.w = kanji
    } else {
        target.w.concat(kanji)
    }
}

const makeDict = function(rawDict) {
    rawDict.split('\n').filter((line) => {
        return !line.startsWith(';')
    }).map((line) => {
        const list = line.replace(' ', '').split('/')
        list.pop()
        return list
    }).filter((list) => {
        return list.length !== 0
    }).forEach((single) => {
        let yomi = single.shift()
        let kanji = single

        const okuri = yomi.match(/[a-z]$/)
        if (okuri && yomi.match(/[ぁ-ん]/)) {
            yomi = yomi.replace(okuri[0], '')
            if(!okuriTable[okuri]) { return }
            okuriTable[okuri].forEach((hiragana) => {
                register(
                    yomi + hiragana,
                    kanji.map((singleKanji) => {
                        return (singleKanji.split(';')[0] + hiragana).replace('っっ', 'っ')
                    })
                )
            })
        } else {
            register(yomi, kanji.map((single) => { return single.split(';')[0] }))
        }
    })

    const target = path.join(
        path.dirname(process.argv[1]),
        '../node_modules/migemo/data/jisho.json'
    )
    fs.writeFileSync(target, JSON.stringify(dictTable))
}

Promise.all(require(root + '/package.json').skkDictGzUrl.map((url) => {
    console.log('Downloading: ' + url)
    return download(url).then((data) => {
        return converter.convert(zlib.gunzipSync(data))
    })
})).then((raws) => {
    makeDict(raws.join('\n'))
})
