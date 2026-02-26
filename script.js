(function () {
  const ingredientInput = document.getElementById('ingredient');
  const excludeInput = document.getElementById('exclude');
  const submitBtn = document.getElementById('submit');
  const resultsEl = document.getElementById('results');

  // パスタのバリエーション（メニュー名のテンプレート）※毎回この中からランダムに最大10個提案
  const pastaTemplates = [
    {
      name: 'のクリームパスタ',
      base: ['スパゲッティ', '生クリーム', 'バター', 'にんにく', '塩', 'こしょう'],
      note: 'クリームソース / こってり / カフェ定番'
    },
    {
      name: 'のトマトパスタ',
      base: ['スパゲッティ', 'トマト', 'にんにく', 'オリーブオイル', '塩', 'こしょう', 'バジル'],
      note: 'トマトソース / さっぱり / 定番'
    },
    {
      name: 'の和風パスタ',
      base: ['スパゲッティ', '醤油', 'だし', 'ごま油', 'ねぎ', '塩', 'こしょう'],
      note: '和風しょうゆ味 / あっさり / 和風喫茶向き'
    },
    {
      name: 'のペペロンチーノ',
      base: ['スパゲッティ', 'にんにく', 'オリーブオイル', '唐辛子', '塩', 'こしょう', 'パセリ'],
      note: 'オイルソース / ピリ辛 / シンプル'
    },
    {
      name: 'のアーリオ・オーリオ',
      base: ['スパゲッティ', 'にんにく', 'オリーブオイル', '塩', 'こしょう', 'パセリ'],
      note: 'オイルソース / にんにく香り強め'
    },
    {
      name: 'のカルボナーラ風',
      base: ['スパゲッティ', '卵', '生クリーム', 'ベーコン', '粉チーズ', '塩', 'こしょう'],
      note: '卵とチーズ / こってり / 人気メニュー向き'
    },
    {
      name: 'のガーリックオイルパスタ',
      base: ['スパゲッティ', 'にんにく', 'オリーブオイル', '塩', 'こしょう', 'パセリ', 'レモン'],
      note: 'オイルソース / さっぱりレモン / 香り高い'
    },
    {
      name: 'のジェノベーゼ風',
      base: ['スパゲッティ', 'バジル', 'にんにく', '松の実', 'オリーブオイル', '粉チーズ', '塩'],
      note: 'バジルソース / 香り豊か / 色鮮やか'
    },
    {
      name: 'のバター醤油パスタ',
      base: ['スパゲッティ', 'バター', '醤油', 'ねぎ', 'ごま', '塩', 'こしょう'],
      note: 'バター醤油味 / 香ばしい / 和風寄り'
    },
    {
      name: 'の冷製パスタ',
      base: ['スパゲッティ', 'オリーブオイル', 'レモン', 'にんにく', 'バジル', '塩', 'こしょう'],
      note: '冷製 / さっぱり / 夏向け'
    },
    {
      name: 'のナポリタン風',
      base: ['スパゲッティ', 'トマトケチャップ', '玉ねぎ', 'ピーマン', 'ウスターソース', '塩', 'こしょう'],
      note: 'ケチャップ味 / 昔ながらの喫茶店風'
    },
    {
      name: 'のチーズクリームパスタ',
      base: ['スパゲッティ', '生クリーム', '粉チーズ', 'バター', 'にんにく', '塩', 'こしょう'],
      note: 'チーズ多め / クリーミー / 濃厚'
    },
    {
      name: 'のレモンバターパスタ',
      base: ['スパゲッティ', 'バター', 'レモン', 'にんにく', '白ワイン', 'パセリ', '塩', 'こしょう'],
      note: 'レモンバターソース / さわやか / 白ワインに合う'
    },
    {
      name: 'の和風ねぎだしパスタ',
      base: ['スパゲッティ', '長ねぎ', 'だし', '醤油', 'ごま油', 'すりごま', '塩'],
      note: 'だし香る和風 / あっさり / 夜メニュー向き'
    },
    {
      name: 'のアジアン風パスタ',
      base: ['スパゲッティ', 'にんにく', 'ごま油', 'ラー油', '醤油', 'ねぎ', 'ごま'],
      note: 'ピリ辛 / アジアンテイスト / ビールに合う'
    },
    {
      name: 'のコンソメバターパスタ',
      base: ['スパゲッティ', 'コンソメ', 'バター', 'にんにく', 'パセリ', '塩', 'こしょう'],
      note: 'コンソメ＆バター / やさしい味 / ランチ向き'
    },
    {
      name: 'のオイルソースパスタ',
      base: ['スパゲッティ', 'オリーブオイル', 'にんにく', '唐辛子', 'アンチョビ', 'パセリ', '塩'],
      note: 'アンチョビ入りオイルソース / 旨み強め'
    },
    {
      name: 'の和風明太子風味',
      base: ['スパゲッティ', '明太子', 'バター', 'のり', 'ねぎ', '醤油'],
      note: '明太子 / クリーミー和風 / 人気メニュー向き'
    },
  ];

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getIngredientsForMenu(mainIngredient, template) {
    const base = template.base.filter(function (item) {
      return item !== mainIngredient;
    });
    return [mainIngredient].concat(base);
  }

  function parseExcludeList(raw) {
    if (!raw) return [];
    return raw
      .split(/[、,，\s]+/)
      .map(function (item) {
        return item.trim();
      })
      .filter(function (item) {
        return item.length > 0;
      });
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function suggestPasta(main, excludeList) {
    const trimmed = main.trim();
    if (!trimmed) return null;

    const excluded = Array.isArray(excludeList) ? excludeList : [];

    const candidates = pastaTemplates.filter(function (t) {
      const ingredients = getIngredientsForMenu(trimmed, t);
      return !ingredients.some(function (ing) {
        return excluded.indexOf(ing) !== -1;
      });
    });

    if (candidates.length === 0) {
      return [];
    }

    const picked = shuffleArray(candidates).slice(0, 10);
    return picked.map(function (t) {
      const menuName = trimmed + t.name;
      const ingredients = getIngredientsForMenu(trimmed, t);
      return {
        menuName: menuName,
        ingredients: ingredients,
        note: t.note || ''
      };
    });
  }

  function renderResults(suggestions) {
    resultsEl.classList.remove('empty');
    resultsEl.innerHTML = suggestions
      .map(function (s) {
        const listItems = s.ingredients
          .map(function (ing) {
            return '<li>' + escapeHtml(ing) + '</li>';
          })
          .join('');
        return (
          '<div class="menu-card">' +
          '<h3>' + escapeHtml(s.menuName) + '</h3>' +
          (s.note ? '<p class="menu-note">' + escapeHtml(s.note) + '</p>' : '') +
          '<p class="ingredients-title">必要な食材</p>' +
          '<ul class="ingredients-list">' + listItems + '</ul>' +
          '</div>'
        );
      })
      .join('');
  }

  function showMessage(text, isError) {
    resultsEl.classList.remove('empty');
    resultsEl.innerHTML =
      '<p class="results-message' + (isError ? ' error' : '') + '">' +
      escapeHtml(text) +
      '</p>';
  }

  function onSubmit() {
    const value = ingredientInput.value;
    const excludeValue = excludeInput ? excludeInput.value : '';
    const excludeList = parseExcludeList(excludeValue);
    const suggestions = suggestPasta(value, excludeList);

    if (!suggestions) {
      showMessage('メイン食材を入力してください。', true);
      return;
    }

    if (suggestions.length === 0) {
      showMessage('条件に合うパスタ候補が見つかりませんでした。入れない食材を減らしてみてください。', false);
      return;
    }

    renderResults(suggestions);
  }

  submitBtn.addEventListener('click', onSubmit);
  ingredientInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') onSubmit();
  });
})();
