﻿function isCompatible(ua){if(ua===undefined){ua=navigator.userAgent;}return!((ua.indexOf('MSIE')!==-1&&parseFloat(ua.split('MSIE')[1])<6)||(ua.indexOf('Firefox/')!==-1&&parseFloat(ua.split('Firefox/')[1])<3)||ua.match(/BlackBerry[^\/]*\/[1-5]\./)||ua.match(/webOS\/1\.[0-4]/)||ua.match(/PlayStation/i)||ua.match(/SymbianOS|Series60/)||ua.match(/NetFront/)||ua.match(/Opera Mini/)||ua.match(/S40OviBrowser/));}var startUp=function(){mw.config=new mw.Map(true);mw.loader.addSource({"local":{"loadScript":"/eurostat/statistics-explained/load.php","apiScript":"/eurostat/statistics-explained/api.php"}});mw.loader.register([["site","1444127290",[],"site"],["noscript","1444127290",[],"noscript"],["startup","1451133559",[],"startup"],["filepage","1444127290"],["user.groups","1444127290",[],"user"],["user","1444127290",[],"user"],["user.cssprefs","1444127290",["mediawiki.user"],"private"],["user.options","1444127290",[],"private"],["user.tokens","1444127290",[],"private"],["mediawiki.language.data",
"1451133559",["mediawiki.language.init"]],["skins.cologneblue","1444127290"],["skins.modern","1444127290"],["skins.monobook","1444127290"],["skins.vector","1444127290"],["skins.vector.beta","1444127290"],["skins.vector.js","1444127290",["jquery.delayedBind"]],["skins.vector.collapsibleNav","1444127290",["jquery.client","jquery.cookie","jquery.tabIndex"]],["jquery","1444127290"],["jquery.appear","1444127290"],["jquery.arrowSteps","1444127290"],["jquery.async","1444127290"],["jquery.autoEllipsis","1444127290",["jquery.highlightText"]],["jquery.badge","1444127290",["mediawiki.language"]],["jquery.byteLength","1444127290"],["jquery.byteLimit","1444127290",["jquery.byteLength"]],["jquery.checkboxShiftClick","1444127290"],["jquery.chosen","1444127290"],["jquery.client","1444127290"],["jquery.color","1444127290",["jquery.colorUtil"]],["jquery.colorUtil","1444127290"],["jquery.cookie","1444127290"],["jquery.delayedBind","1444127290"],["jquery.expandableField","1444127290",["jquery.delayedBind"
]],["jquery.farbtastic","1444127290",["jquery.colorUtil"]],["jquery.footHovzer","1444127290"],["jquery.form","1444127290"],["jquery.getAttrs","1444127290"],["jquery.hidpi","1444127290"],["jquery.highlightText","1444127290",["jquery.mwExtension"]],["jquery.hoverIntent","1444127290"],["jquery.json","1444127290"],["jquery.localize","1444127290"],["jquery.makeCollapsible","1450716419"],["jquery.mockjax","1444127290"],["jquery.mw-jump","1444127290"],["jquery.mwExtension","1444127290"],["jquery.placeholder","1444127290"],["jquery.qunit","1444127290"],["jquery.qunit.completenessTest","1444127290",["jquery.qunit"]],["jquery.spinner","1444127290"],["jquery.jStorage","1444127290",["jquery.json"]],["jquery.suggestions","1444127290",["jquery.autoEllipsis"]],["jquery.tabIndex","1444127290"],["jquery.tablesorter","1450718056",["jquery.mwExtension","mediawiki.language.months"]],["jquery.textSelection","1444127290",["jquery.client"]],["jquery.validate","1444127290"],["jquery.xmldom","1444127290"],[
"jquery.tipsy","1444127290"],["jquery.ui.core","1444127290",["jquery"],"jquery.ui"],["jquery.ui.widget","1444127290",[],"jquery.ui"],["jquery.ui.mouse","1444127290",["jquery.ui.widget"],"jquery.ui"],["jquery.ui.position","1444127290",[],"jquery.ui"],["jquery.ui.draggable","1444127290",["jquery.ui.core","jquery.ui.mouse","jquery.ui.widget"],"jquery.ui"],["jquery.ui.droppable","1444127290",["jquery.ui.core","jquery.ui.mouse","jquery.ui.widget","jquery.ui.draggable"],"jquery.ui"],["jquery.ui.resizable","1444127290",["jquery.ui.core","jquery.ui.widget","jquery.ui.mouse"],"jquery.ui"],["jquery.ui.selectable","1444127290",["jquery.ui.core","jquery.ui.widget","jquery.ui.mouse"],"jquery.ui"],["jquery.ui.sortable","1444127290",["jquery.ui.core","jquery.ui.widget","jquery.ui.mouse"],"jquery.ui"],["jquery.ui.accordion","1444127290",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.ui.autocomplete","1444127290",["jquery.ui.core","jquery.ui.widget","jquery.ui.position"],"jquery.ui"],[
"jquery.ui.button","1444127290",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.ui.datepicker","1444127290",["jquery.ui.core"],"jquery.ui"],["jquery.ui.dialog","1444127290",["jquery.ui.core","jquery.ui.widget","jquery.ui.button","jquery.ui.draggable","jquery.ui.mouse","jquery.ui.position","jquery.ui.resizable"],"jquery.ui"],["jquery.ui.progressbar","1444127290",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.ui.slider","1444127290",["jquery.ui.core","jquery.ui.widget","jquery.ui.mouse"],"jquery.ui"],["jquery.ui.tabs","1444127290",["jquery.ui.core","jquery.ui.widget"],"jquery.ui"],["jquery.effects.core","1444127290",["jquery"],"jquery.ui"],["jquery.effects.blind","1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.bounce","1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.clip","1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.drop","1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.explode",
"1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.fade","1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.fold","1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.highlight","1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.pulsate","1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.scale","1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.shake","1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.slide","1444127290",["jquery.effects.core"],"jquery.ui"],["jquery.effects.transfer","1444127290",["jquery.effects.core"],"jquery.ui"],["mediawiki","1444127290"],["mediawiki.api","1444127290",["mediawiki.util"]],["mediawiki.api.category","1444127290",["mediawiki.api","mediawiki.Title"]],["mediawiki.api.edit","1444127290",["mediawiki.api","mediawiki.Title"]],["mediawiki.api.login","1444127290",["mediawiki.api"]],["mediawiki.api.parse","1444127290",["mediawiki.api"]],[
"mediawiki.api.watch","1444127290",["mediawiki.api","user.tokens"]],["mediawiki.icon","1444127290"],["mediawiki.debug","1444127290",["jquery.footHovzer"]],["mediawiki.debug.init","1444127290",["mediawiki.debug"]],["mediawiki.inspect","1444127290",["jquery.byteLength","jquery.json"]],["mediawiki.feedback","1444127290",["mediawiki.api.edit","mediawiki.Title","mediawiki.jqueryMsg","jquery.ui.dialog"]],["mediawiki.hidpi","1444127290",["jquery.hidpi"]],["mediawiki.htmlform","1450773162"],["mediawiki.notification","1444127290",["mediawiki.page.startup"]],["mediawiki.notify","1444127290"],["mediawiki.searchSuggest","1450716419",["jquery.autoEllipsis","jquery.client","jquery.placeholder","jquery.suggestions","mediawiki.api"]],["mediawiki.Title","1444127290",["jquery.byteLength","mediawiki.util"]],["mediawiki.Uri","1444127290"],["mediawiki.user","1444127290",["jquery.cookie","mediawiki.api","user.options","user.tokens"]],["mediawiki.util","1450716418",["jquery.client","jquery.cookie",
"jquery.mwExtension","mediawiki.notify"]],["mediawiki.action.edit","1444127290",["mediawiki.action.edit.styles","jquery.textSelection","jquery.byteLimit"]],["mediawiki.action.edit.styles","1444127290"],["mediawiki.action.edit.collapsibleFooter","1444127290",["jquery.makeCollapsible","mediawiki.icon"]],["mediawiki.action.edit.preview","1444127290",["jquery.form","jquery.spinner","mediawiki.action.history.diff"]],["mediawiki.action.history","1444127290",[],"mediawiki.action.history"],["mediawiki.action.history.diff","1444127290",[],"mediawiki.action.history"],["mediawiki.action.view.dblClickEdit","1444127290",["mediawiki.util","mediawiki.page.startup"]],["mediawiki.action.view.metadata","1444127290"],["mediawiki.action.view.postEdit","1450716419",["jquery.cookie","mediawiki.jqueryMsg"]],["mediawiki.action.view.rightClickEdit","1444127290"],["mediawiki.action.edit.editWarning","1450716636"],["mediawiki.action.watch.ajax","1444127290",["mediawiki.page.watch.ajax"]],["mediawiki.language",
"1444127290",["mediawiki.language.data","mediawiki.cldr"]],["mediawiki.cldr","1444127290",["mediawiki.libs.pluralruleparser"]],["mediawiki.libs.pluralruleparser","1444127290"],["mediawiki.language.init","1444127290"],["mediawiki.jqueryMsg","1444127290",["mediawiki.util","mediawiki.language"]],["mediawiki.language.months","1450718056",["mediawiki.language"]],["mediawiki.libs.jpegmeta","1444127290"],["mediawiki.page.gallery","1444127290"],["mediawiki.page.ready","1444127290",["jquery.checkboxShiftClick","jquery.makeCollapsible","jquery.placeholder","jquery.mw-jump","mediawiki.util"]],["mediawiki.page.startup","1444127290",["jquery.client","mediawiki.util"]],["mediawiki.page.patrol.ajax","1444127290",["mediawiki.page.startup","mediawiki.api","mediawiki.util","mediawiki.Title","mediawiki.notify","jquery.spinner","user.tokens"]],["mediawiki.page.watch.ajax","1444127290",["mediawiki.page.startup","mediawiki.api.watch","mediawiki.util","mediawiki.notify","jquery.mwExtension"]],[
"mediawiki.page.image.pagination","1444127290",["jquery.spinner"]],["mediawiki.special","1444127290"],["mediawiki.special.block","1444127290",["mediawiki.util"]],["mediawiki.special.changeemail","1450772534",["mediawiki.util"]],["mediawiki.special.changeslist","1444127290"],["mediawiki.special.changeslist.enhanced","1444127290"],["mediawiki.special.movePage","1444127290",["jquery.byteLimit"]],["mediawiki.special.pagesWithProp","1444127290"],["mediawiki.special.preferences","1444127290"],["mediawiki.special.recentchanges","1444127290",["mediawiki.special"]],["mediawiki.special.search","1450716664"],["mediawiki.special.undelete","1444127290"],["mediawiki.special.upload","1450776033",["mediawiki.libs.jpegmeta","mediawiki.util"]],["mediawiki.special.userlogin","1444127290"],["mediawiki.special.createaccount","1444127290"],["mediawiki.special.createaccount.js","1444127290",["mediawiki.jqueryMsg"]],["mediawiki.special.javaScriptTest","1444127290",["jquery.qunit"]],[
"mediawiki.tests.qunit.testrunner","1444127290",["jquery.getAttrs","jquery.qunit","jquery.qunit.completenessTest","mediawiki.page.startup","mediawiki.page.ready"]],["mediawiki.legacy.ajax","1444127290",["mediawiki.util","mediawiki.legacy.wikibits"]],["mediawiki.legacy.commonPrint","1444127290"],["mediawiki.legacy.config","1444127290",["mediawiki.legacy.wikibits"]],["mediawiki.legacy.protect","1444127290",["jquery.byteLimit"]],["mediawiki.legacy.shared","1444127290"],["mediawiki.legacy.oldshared","1444127290"],["mediawiki.legacy.upload","1444127290",["jquery.spinner","mediawiki.api","mediawiki.Title","mediawiki.util"]],["mediawiki.legacy.wikibits","1444127290",["mediawiki.util"]],["mediawiki.ui","1444127290"],["skins.statexpflat","1448355108",["jquery"]],["ext.categoryTree","1450716443"],["ext.categoryTree.css","1444127290"],["ext.cite","1450716419"],["ext.cite.popups","1444127290",["jquery.tooltip"]],["jquery.tooltip","1444127290"],["ext.rtlcite","1444127290"],["ext.StatexpBPM",
"1444127290"],["ext.EurostatTranslate","1444127290"],["ext.EurostatMainPageManagementArticlesLogs","1449148449",["jquery.json"]],["ext.EurostatMainPageManagement","1444725255",["jquery.json","jquery.ui.tabs","jquery.ui.selectable","jquery.ui.dialog","jquery.ui.datepicker"]],["ext.EurostatMainPageManagementMainPage","1444127290"],["ext.StatexpPiwikSpecial","1444127290",["jquery.json","jquery.ui.dialog","jquery.ui.datepicker"]],["ext.EurostatCategorySearch","1444127290",["jquery.ui.autocomplete"]],["contentCollector","1444127290",[],"ext.wikiEditor"],["jquery.wikiEditor","1450716636",["jquery.client","jquery.textSelection","jquery.delayedBind"],"ext.wikiEditor"],["jquery.wikiEditor.iframe","1444127290",["jquery.wikiEditor","contentCollector"],"ext.wikiEditor"],["jquery.wikiEditor.dialogs","1444127290",["jquery.wikiEditor","jquery.wikiEditor.toolbar","jquery.ui.dialog","jquery.ui.button","jquery.ui.draggable","jquery.ui.resizable","jquery.tabIndex"],"ext.wikiEditor"],[
"jquery.wikiEditor.dialogs.config","1444127290",["jquery.wikiEditor","jquery.wikiEditor.dialogs","jquery.wikiEditor.toolbar.i18n","jquery.suggestions","mediawiki.Title","mediawiki.jqueryMsg"],"ext.wikiEditor"],["jquery.wikiEditor.highlight","1444127290",["jquery.wikiEditor","jquery.wikiEditor.iframe"],"ext.wikiEditor"],["jquery.wikiEditor.preview","1444127290",["jquery.wikiEditor"],"ext.wikiEditor"],["jquery.wikiEditor.previewDialog","1444127290",["jquery.wikiEditor","jquery.wikiEditor.dialogs"],"ext.wikiEditor"],["jquery.wikiEditor.publish","1444127290",["jquery.wikiEditor","jquery.wikiEditor.dialogs"],"ext.wikiEditor"],["jquery.wikiEditor.templateEditor","1444127290",["jquery.wikiEditor","jquery.wikiEditor.iframe","jquery.wikiEditor.dialogs"],"ext.wikiEditor"],["jquery.wikiEditor.templates","1444127290",["jquery.wikiEditor","jquery.wikiEditor.iframe"],"ext.wikiEditor"],["jquery.wikiEditor.toc","1444127290",["jquery.wikiEditor","jquery.wikiEditor.iframe","jquery.ui.draggable",
"jquery.ui.resizable","jquery.autoEllipsis","jquery.color"],"ext.wikiEditor"],["jquery.wikiEditor.toolbar","1444127290",["jquery.wikiEditor","jquery.wikiEditor.toolbar.i18n"],"ext.wikiEditor"],["jquery.wikiEditor.toolbar.config","1444127290",["jquery.wikiEditor","jquery.wikiEditor.toolbar.i18n","jquery.wikiEditor.toolbar","jquery.cookie","jquery.async"],"ext.wikiEditor"],["jquery.wikiEditor.toolbar.i18n","1444127290",[],"ext.wikiEditor"],["ext.wikiEditor","1444127290",["jquery.wikiEditor"],"ext.wikiEditor"],["ext.wikiEditor.dialogs","1444127290",["ext.wikiEditor","ext.wikiEditor.toolbar","jquery.wikiEditor.dialogs","jquery.wikiEditor.dialogs.config"],"ext.wikiEditor"],["ext.wikiEditor.highlight","1444127290",["ext.wikiEditor","jquery.wikiEditor.highlight"],"ext.wikiEditor"],["ext.wikiEditor.preview","1444127290",["ext.wikiEditor","jquery.wikiEditor.preview"],"ext.wikiEditor"],["ext.wikiEditor.previewDialog","1444127290",["ext.wikiEditor","jquery.wikiEditor.previewDialog"],
"ext.wikiEditor"],["ext.wikiEditor.publish","1444127290",["ext.wikiEditor","jquery.wikiEditor.publish"],"ext.wikiEditor"],["ext.wikiEditor.templateEditor","1444127290",["ext.wikiEditor","ext.wikiEditor.highlight","jquery.wikiEditor.templateEditor"],"ext.wikiEditor"],["ext.wikiEditor.templates","1444127290",["ext.wikiEditor","ext.wikiEditor.highlight","jquery.wikiEditor.templates"],"ext.wikiEditor"],["ext.wikiEditor.toc","1444127290",["ext.wikiEditor","ext.wikiEditor.highlight","jquery.wikiEditor.toc"],"ext.wikiEditor"],["ext.wikiEditor.tests.toolbar","1444127290",["ext.wikiEditor.toolbar"],"ext.wikiEditor"],["ext.wikiEditor.toolbar","1444127290",["ext.wikiEditor","jquery.wikiEditor.toolbar","jquery.wikiEditor.toolbar.config"],"ext.wikiEditor"],["ext.wikiEditor.toolbar.hideSig","1444127290",[],"ext.wikiEditor"],["ext.StatexpEditor","1444127290",["ext.wikiEditor","jquery.wikiEditor.toolbar","jquery.wikiEditor.dialogs","jquery.cookie","jquery.async","jquery.mask"],"ext.StatexpEditor"],[
"ext.StatexpEditor.clear","1444127290",["ext.StatexpEditor"],"ext.StatexpEditor"],["ext.StatexpEditor.modules","1450716636",["ext.StatexpEditor"],"ext.StatexpEditor"],["jquery.mask","1444127290",[],"ext.StatexpEditor"],["ext.math.mathjax","1444127290",[],"ext.math.mathjax"],["ext.math.mathjax.enabler","1444127290"]]);mw.config.set({"wgLoadScript":"/eurostat/statistics-explained/load.php","debug":false,"skin":"statexpflat","stylepath":"http://ec.europa.eu/eurostat/statistics-explained/skins","wgUrlProtocols":"http\\:\\/\\/|https\\:\\/\\/|ftp\\:\\/\\/|ftps\\:\\/\\/|ssh\\:\\/\\/|sftp\\:\\/\\/|irc\\:\\/\\/|ircs\\:\\/\\/|xmpp\\:|sip\\:|sips\\:|gopher\\:\\/\\/|telnet\\:\\/\\/|nntp\\:\\/\\/|worldwind\\:\\/\\/|mailto\\:|tel\\:|sms\\:|news\\:|svn\\:\\/\\/|git\\:\\/\\/|mms\\:\\/\\/|bitcoin\\:|magnet\\:|urn\\:|geo\\:|\\/\\/","wgArticlePath":"/eurostat/statistics-explained/index.php/$1","wgScriptPath":"/eurostat/statistics-explained","wgScriptExtension":".php","wgScript":
"/eurostat/statistics-explained/index.php","wgVariantArticlePath":false,"wgActionPaths":{},"wgServer":"http://ec.europa.eu","wgUserLanguage":"en","wgContentLanguage":"en","wgVersion":"1.22.5","wgEnableAPI":true,"wgEnableWriteAPI":true,"wgMainPageTitle":"Main Page","wgFormattedNamespaces":{"-2":"Media","-1":"Special","0":"","1":"Talk","2":"User","3":"User talk","4":"Statistics Explained","5":"Statistics Explained talk","6":"File","7":"File talk","8":"MediaWiki","9":"MediaWiki talk","10":"Template","11":"Template talk","12":"Help","13":"Help talk","14":"Category","15":"Category talk","100":"Glossary","101":"Glossary talk","104":"Configuration","105":"Configuration talk","108":"EuroStat","109":"EuroStatAdm","110":"Archive","111":"StatExp","120":"Glossar","121":"Glossar talk","122":"Glossaire","123":"Glossaire talk","124":"Glossarium","125":"Glossarium talk","126":"Sõnastik","127":"Sõnastik talk","128":"Słownik","129":"Słownik talk","130":"Γλωσσάριo","131":
"Γλωσσάριo talk","132":"Ordlista","133":"Ordlista talk","134":"Orðalisti","135":"Orðalisti talk"},"wgNamespaceIds":{"media":-2,"special":-1,"":0,"talk":1,"user":2,"user_talk":3,"statistics_explained":4,"statistics_explained_talk":5,"file":6,"file_talk":7,"mediawiki":8,"mediawiki_talk":9,"template":10,"template_talk":11,"help":12,"help_talk":13,"category":14,"category_talk":15,"glossary":100,"glossary_talk":101,"configuration":104,"configuration_talk":105,"eurostat":108,"eurostatadm":109,"archive":110,"statexp":111,"glossar":120,"glossar_talk":121,"glossaire":122,"glossaire_talk":123,"glossarium":124,"glossarium_talk":125,"sõnastik":126,"sõnastik_talk":127,"słownik":128,"słownik_talk":129,"γλωσσάριo":130,"γλωσσάριo_talk":131,"ordlista":132,"ordlista_talk":133,"orðalisti":134,"orðalisti_talk":135,"image":6,"image_talk":7,"project":4,"project_talk":5},"wgSiteName":"Statistics Explained","wgFileExtensions":["png","gif","jpg","jpeg","doc","xls","xlsx","docx"]
,"wgDBname":"STAT_EXP_3","wgFileCanRotate":true,"wgAvailableSkins":{"statexpflat":"StatexpFlat","cologneblue":"CologneBlue","vector":"Vector","modern":"Modern","monobook":"MonoBook"},"wgExtensionAssetsPath":"/eurostat/statistics-explained/extensions","wgCookiePrefix":"STAT_EXP_3","wgResourceLoaderMaxQueryLength":-1,"wgCaseSensitiveNamespaces":[],"wgLegalTitleChars":" %!\"$\u0026'()*,\\-./0-9:;=?@A-Z\\\\\\^_`a-z~+\\u0080-\\uFFFF","wgWikiEditorMagicWords":{"redirect":"#REDIRECT","img_right":"right","img_left":"left","img_none":"none","img_center":"center","img_thumbnail":"thumbnail","img_framed":"framed","img_frameless":"frameless"}});};if(isCompatible()){document.write("\u003Cscript src=\"/eurostat/statistics-explained/load.php?debug=false\u0026amp;lang=en\u0026amp;modules=jquery%2Cmediawiki\u0026amp;only=scripts\u0026amp;skin=statexpflat\u0026amp;version=20150325T093437Z\"\u003E\u003C/script\u003E");}delete isCompatible;
/* cache key: STAT_EXP_3:resourceloader:filter:minify-js:7:8f724c6b366e481d21dd1e8e0887adc2 */