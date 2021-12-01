export let d10 =[[0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29],[30]]
for(let i = 1; i < d10[0].length; i++){let wi = d10[1][i-1]+30;d10[1].push(wi)}

export let d50 = [[0, 1, 2, 3, 4, 5],[150]]
for(let i = 1; i < d50[0].length; i++){let wi = d50[1][i-1]+150;d50[1].push(wi)}

export let d100 = [[0, 1, 2],[300]]
for(let i = 1; i < d100[0].length; i++){let wi = d100[1][i-1]+300;d100[1].push(wi)}

export let az10 = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],[0]]
for(let i = 1; i < az10[0].length; i++){let wi = az10[1][i-1]+10;az10[1].push(wi)}

export let az30 = [[0, 1, 2, 3, 4, 5, 6, 7],[0]]
for(let i = 1; i < az30[0].length; i++){let wi = az30[1][i-1]+30;az30[1].push(wi)}