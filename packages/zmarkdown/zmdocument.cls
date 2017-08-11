\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{zmdocument}

\LoadClass[fontsize=12pt,twoside=false,numbers=enddot,parskip=half]{scrbook}

%%% PACKAGES -------------------------------------------------------------------

\RequirePackage[utf8]{inputenc}
\RequirePackage[T1]{fontenc}
\RequirePackage{scrhack}
\RequirePackage[dvipsnames,table]{xcolor}
\RequirePackage{scrlayer-scrpage}
\RequirePackage{minted}
\RequirePackage{amsmath,amssymb}
\RequirePackage[francais]{babel}
\RequirePackage[babel=true]{microtype}
\RequirePackage{caption}
\RequirePackage{ulem}
\RequirePackage{newfloat}

%% LATEX 3 PACKAGES
\RequirePackage{etoolbox}
\RequirePackage{xparse}
\RequirePackage{xsavebox}

\RequirePackage{multicol}
\RequirePackage{pagecolor}

%%% TABLE PACKAGES
\RequirePackage{multirow}
\RequirePackage{longtable}
\RequirePackage{tabu}

%%% GRAPHIC PACKAGES
\RequirePackage{graphicx}
\RequirePackage[export]{adjustbox}
\RequirePackage{epstopdf}

\epstopdfDeclareGraphicsRule{.gif}{png}{.png}{convert gif:#1 png:\OutputFile}
\AppendGraphicsExtensions{.gif}

\epstopdfDeclareGraphicsRule{.svg}{pdf}{.pdf}{rsvg-convert -f pdf #1 -o \OutputFile}
\AppendGraphicsExtensions{.svg}

\RequirePackage[bookmarks=true,hyperindex=true,bookmarksopen=true,bookmarksnumbered=true]{hyperref}
\RequirePackage[thmmarks,amsmath,hyperref]{ntheorem}
\RequirePackage[hyperrefcolorlinks]{menukeys}

%%% ABBREVIATIONS PACKAGES
\RequirePackage{glossaries}

%%% COLORS ---------------------------------------------------------------------

\definecolor{internalLinkColor}{HTML}{FF9400}

\definecolor{chapterColor}{HTML}{EA9408}
\definecolor{sectionColor}{HTML}{EA9408}
\definecolor{subsectionColor}{HTML}{EA9408}
\definecolor{subsubsectionColor}{HTML}{EA9408}
\definecolor{paragraphColor}{HTML}{000000}
\definecolor{subparagraphColor}{HTML}{000000}

\definecolor{warningColor}{HTML}{FFAD7A}      %Apricot
\definecolor{errorColor}{HTML}{FF3B21}        %RedOrange
\definecolor{informationColor}{HTML}{55E0E0}  %SkyBlue
\definecolor{questionColor}{HTML}{Ad5CFF}     %Orchid
\definecolor{quotationColor}{HTML}{555555}
\definecolor{spoilerColor}{HTML}{555555}
\definecolor{iframeColor}{HTML}{009700}

\definecolor{titlePageBackgroundColor}{HTML}{094561}
\definecolor{titlePageEditorColor}{HTML}{F8AD32}
\definecolor{titlePageTextColor}{HTML}{FFFFFF}
\definecolor{titlePageAuthorColor}{HTML}{FF9400}

\definecolor{highlightCodeColor}{HTML}{E0FFFF}

\hypersetup{linkcolor=internalLinkColor}

%%% CONSTANTS ------------------------------------------------------------------

\setlength{\tabcolsep}{0.2cm}
\renewcommand{\arraystretch}{1.5}

%%% FLOATS ---------------------------------------------------------------------

\DeclareFloatingEnvironment[name={Équation}]{equationFloat}

%%% CLASS OPTIONS --------------------------------------------------------------

%%% PRINTING OPTION
\DeclareOption{print}{
   \renewcommand{\externalLink}[2]{\textbf{[#1](#2)}}
}

%%% SECTIONNING OPTIONS
\lohead{\headmark}
\chead{}
\pagestyle{scrheadings}

\DeclareOption{small}{
   \let\levelOneTitle\section
   \let\levelTwoTitle\subsection
   \let\levelThreeTitle\subsubsection
   \let\levelFourTitle\paragraph
   \let\levelFiveTitle\subparagraph
   \newcommand{\levelOneIntroduction}{\addsec{Introduction}}
   \newcommand{\levelOneConclusion}{\addsec{Conclusion}}
   \def\thesection{\arabic{section}}
   \def\thefigure{\arabic{section}}
   \def\thetable{\arabic{section}}
   \def\theequationFloat{\arabic{section}}
   \automark[subsection]{section}
}

\DeclareOption{middle}{
   \newcommand{\levelOneTitle}[1]{\displaySpoilers \chapter{#1}}
   \let\levelTwoTitle\section
   \let\levelThreeTitle\subsection
   \let\levelFourTitle\subsubsection
   \let\levelFiveTitle\paragraph
   \let\levelSixTitle\subparagaph
   \newcommand{\levelOneIntroduction}{\addchap{Introduction}}
   \newcommand{\levelOneConclusion}{\displaySpoilers \addchap{Conclusion}}
   \newcommand{\levelTwoIntroduction}{\addsec{Introduction}}
   \newcommand{\levelTwoConclusion}{\addsec{Conclusion}}
   \automark[section]{chapter}
}

\DeclareOption{big}{
   \newcommand\levelOneTitle[1]{\displaySpoilers \part{#1}}
   \newcommand\levelTwoTitle[1]{\displaySpoilers \chapter{#1}}
   \let\levelThreeTitle\section
   \let\levelFourTitle\subsection
   \let\levelFiveTitle\subsubsection
   \let\levelSixTitle\paragraph
   \let\levelSevenTitle\subparagaph
   \newcommand{\levelOneIntroduction}{\addpart{Introduction}}
   \newcommand{\levelOneConclusion}{\displaySpoilers \addpart{Conclusion}}
   \newcommand{\levelTwoIntroduction}{\addchap{Introduction}}
   \newcommand{\levelTwoConclusion}{\displaySpoilers \addchap{Conclusion}}
   \newcommand{\levelThreeIntroduction}{\addsec{Introduction}}
   \newcommand{\levelThreeConclusion}{\addsec{Conclusion}}
   \automark[chapter]{part}
}

%%% NOCOLOR
\DeclareOption{nocolor}{
   \definecolor{titlePageBackgroundColor}{HTML}{FFFFFF}
   \definecolor{titlePageEditorColor}{HTML}{000000}
   \definecolor{titlePageTextColor}{HTML}{000000}
}

%%% PROCESSING
\ProcessOptions

%%% POST-PROCESSING
\addtokomafont{chapter}{\color{chapterColor}}
\addtokomafont{section}{\color{sectionColor}}
\addtokomafont{subsection}{\color{subsectionColor}}
\addtokomafont{subsubsection}{\color{sectionColor}}
\addtokomafont{paragraph}{\color{paragraphColor}}
\addtokomafont{subparagraph}{\color{subparagraphColor}}

\setcounter{secnumdepth}{4}

%%% CUSTOMS ENVIRONMENTS AND MACROS ------------------------------------------

%%% LINKS
\newcommand{\externalLink}[2]{\href{#2}{#1}}

%%% ZDS BOX
\newcommand{\newZdSBox}[3]{{%
   \theoremprework{~\\ \textcolor{#3}{\rule{0.6\linewidth}{1pt}}}
   \theorempostwork{\hfill \textcolor{#3}{\rule{0.6\linewidth}{1pt}} \\}
   \theoremindent=2em
   \theoremheaderfont{\scshape\hspace{-2em}}
   \theoremseparator{ ---}
   \theoremstyle{break}
   \theorembodyfont{\normalfont}
   \newtheorem*{#1}{\textcolor{#3}{#2}}
}}

\newcommand{\newZdSBoxEnvironment}[2]{%
   \newenvironment{#1}{~\\ \begin{minipage}{\linewidth}\begin{#2}}
                      {\end{#2}\end{minipage}}
}

\newZdSBox{InformationBox}{Information}{informationColor}
\newZdSBox{QuestionBox}{Question}{questionColor}
\newZdSBox{ErrorBox}{Erreur}{errorColor}
\newZdSBox{WarningBox}{Attention}{warningColor}
\newZdSBox{QuotationBox}{Citation}{quotationColor}
\newZdSBox{SpoilerBox}{Secret}{spoilerColor}
\newZdSBox{IframeBox}{Élément externe}{iframeColor}

\newZdSBoxEnvironment{Warning}{WarningBox}
\newZdSBoxEnvironment{Question}{QuestionBox}
\newZdSBoxEnvironment{Information}{InformationBox}
\newZdSBoxEnvironment{Error}{ErrorBox}
\newZdSBoxEnvironment{SpoilerEnv}{SpoilerBox}

%%% CODE MANAGEMENT
\setminted{breaklines, breaksymbolleft=\hspace{2em}, highlightcolor=highlightCodeColor, linenos, fontsize=\small,baselinestretch=1}

\NewDocumentEnvironment{CodeBlock}{O{}O{}O{1}m}{%
   \def\@codeCaption{#1}
   \VerbatimEnvironment
   \FrameSep0.5em
   \begin{framed}\vspace{-1em}
   \begin{minted}[highlightlines={#2}, firstnumber=#3]{#4}%
}{
   \end{minted}\vspace{-0.5em}
   \end{framed}
   \ifdefvoid{\@codeCaption}{}{\captionof{listing}{\@codeCaption}}
}


%%% QUOTATION
\NewDocumentEnvironment{Quotation}{o}{%
   \begin{minipage}{\linewidth}\begin{QuotationBox}
}{%
   \IfValueT{#1}{\hfill(#1)} \end{QuotationBox}\end{minipage}
}

%%% IFRAMES
\newenvironment{Iframe}[1]{%
   ~\\ \begin{minipage}{\linewidth}\begin{IframeBox}[#1]
}{%
   \end{IframeBox}\end{minipage}
}

\NewDocumentCommand\iframe{mO{vidéo}o}{%
   \begin{Iframe}{#2}
      Consultez cet élément à l'adresse \url{#1}.\IfValueT{#3}{\\ #3}
   \end{Iframe}
}

%%% SPOILER MANAGEMENT
\let\levelSpoilerTitle\addsec
\let\levelSpoiler\subsection

\newcounter{@spoilerCounter}
\def\@spoilerList{}

\newenvironment{Spoiler}{%
   \addtocounter{@spoilerCounter}{1}%
   \begin{xlrbox}{spoilerSavebox\the@spoilerCounter}\begin{minipage}{\linewidth}\begin{NoHyper}%
}{
   \vspace*{1em}\end{NoHyper}\end{minipage}\end{xlrbox}%
   \hypertarget{voir:\thepart\thechapter\the@spoilerCounter}{}
   \begin{SpoilerEnv}
      \hyperlink{secret:\thepart\thechapter\the@spoilerCounter}{Voir le secret \the@spoilerCounter.}
   \end{SpoilerEnv}
   \listgadd{\@spoilerList}{\xusebox{spoilerSavebox\the@spoilerCounter}}
}

\newcommand{\displaySpoilers}{%
   \setcounter{@spoilerCounter}{1}
   \ifdefvoid{\@spoilerList}{}{\levelSpoilerTitle{Blocs secrets}}
   \def\do{}
   \renewcommand{\do}[1]{%
      \levelSpoiler*{Secret \the@spoilerCounter}%
      \hypertarget{secret:\thepart\thechapter\the@spoilerCounter}{}
      \expandafter{##1}\\ \hfill \hyperlink{voir:\thepart\thechapter\the@spoilerCounter}{Retourner au texte.}
      \addtocounter{@spoilerCounter}{1}
   }
   \expandafter\dolistloop{\@spoilerList}
   \def\@spoilerList{}
   \setcounter{@spoilerCounter}{0}
}

\AtEndDocument{%
    \displaySpoilers
    \printglossary[title=Liste des abréviations]
}

%%% TITLE PAGE
\newcommand{\licence}[1]{\def\@licence{#1}}
\newcommand{\logo}[1]{\def\@logo{#1}}
\newcommand{\website}[1]{\def\@website{#1}}
\newcommand{\editor}[1]{\def\@editor{#1}}
\newcommand{\editorlogo}[1]{\def\@editorlogo{#1}}
\newcommand{\authorlink}[1]{\def\@authorlink{#1}}

\newcounter{@listSize}
\newcommand{\getListSize}[1]{%
   \setcounter{@listSize}{0}
   \renewcommand*{\do}[1]{\addtocounter{@listSize}{1}}
   \expandafter\docsvlist\expandafter{#1}
}

\newcommand{\formatAuthors}{%
   \setlength{\columnsep}{0pt}
   \newcounter{@authorsNumber}
   \newcounter{@authorsByColumn}
   \newcounter{@columnNumber}
   \setcounter{@authorsByColumn}{5}
   \getListSize{\@author}
   \setcounter{@authorsNumber}{\the@listSize}
   \setcounter{@columnNumber}{\the\numexpr(1 + \the@authorsNumber / \the@authorsByColumn)\relax}
   \thispagestyle{empty}
   \begin{flushright}
      \Large \bfseries \renewcommand*{\do}[1]{\href{\@authorlink/##1/}{\color{titlePageAuthorColor}\bsc{##1}}\\}
      \ifnum\the@authorsNumber < \the\numexpr(1+\the@authorsByColumn)
         \expandafter\docsvlist\expandafter{\@author}
      \else
         \begin{multicols}{\the@columnNumber}
            \expandafter\docsvlist\expandafter{\@author}
         \end{multicols}
      \fi
   \end{flushright}
}

\renewcommand{\maketitle}{%
   \ifcsdef{@authorlink}{}{\authorlink{https://zestedesavoir.com/membres/voir}}
   \ifcsdef{@website}{}{\website{https://zestedesavoir.com}}
   \ifcsdef{@editor}{}{\editor{https://zestedesavoir.com}}
   \ifcsdef{@editorlogo}{}{\editorlogo{zestedesavoir.png}}
   \ifcsdef{@logo}{}{\logo{default_logo.png}}
   \pagecolor{titlePageBackgroundColor}
   \color{titlePageTextColor}
   \clearpage
   \formatAuthors
   \begin{center}
      \vspace*{\fill}
      \includegraphics[max width=\textwidth, max height=4cm, keepaspectratio]{\@logo}\\
      \rule{\linewidth}{0.2 mm} \\[0.4 cm]
      \huge\textbf{\@title}\\
      \rule{\linewidth}{0.2 mm} \\[1 cm]
      \large\textbf{Ce tutoriel est sous licence \@licence}\\
      \vspace{\fill}
      \includegraphics[max width=8cm, max height=2cm, keepaspectratio]{\@editorlogo}\\
      \href{\@website}{\color{titlePageEditorColor}\@editor}
   \end{center}
   \newpage
   \newpagecolor{white}
   \color{black}
   \setcounter{page}{1}
}

\hypersetup{pdftitle={\@title}}
\hypersetup{pdfauthor={\@author}}

%%% IMAGES
\NewDocumentCommand{\image}{mo}{%
   \begin{center}
      \includegraphics[max size={\textwidth}{0.9\textheight}, keepaspectratio]{#1}
      \IfValueT{#2}{\captionof{figure}{#2}}
   \end{center}
}

\newcommand{\inlineImage}[1]{\includegraphics[max size={\textwidth}{\textheight}, keepaspectratio]{#1}}

%%% SMILEYS
\def\@smileysPath{./smileys}
\newcommand{\smileysPath}[1]{\def\@smileysPath{#1}}
\newcommand{\smiley}[1]{\raisebox{-3pt}{\includegraphics[height=15pt]{\@smileysPath/#1}} }

%%% HORIZONTAL LINE
\newcommand{\horizontalLine}{{\color{gray}\rule{\textwidth}{0.2pt}}}

%%% ABBREVIATIONS
\newcommand{\abbr}[2]{%
   \newglossaryentry{#1}{name=#1, description={#2}}%
   \dotuline{\gls{#1}}
}
