let currentPly = 0;
let nbOfPlies = 0;

function getCell( ply ) {
	let tab = document.getElementById( "moves_table" );
	let rowIndex = Math.floor( ply / 2 );
	let cellIndex = 1 + ( ply % 2 );
	let cell = tab.rows[ rowIndex ].cells[ cellIndex ];
	return cell;
}

function getMove( ply ) {
	return getCell( ply ).innerHTML;
}

function setMove( ply, move ) {
	getCell( ply ).innerHTML = move;
}

function getCurrentMove() {
	return getMove( currentPly );
}

function setCurrentMove( move ) {
	setMove( currentPly, move );
}

function currentMoveIsAtEnd() {
	for ( let i = currentPly; i < nbOfPlies; ++i ) {
		let m = getMove( i );
		if ( m != "" ) {
			return false;
		}
	}
	return true;
}

function moveExist() {
	for ( let i = 0; i < nbOfPlies; ++i ) {
		let m = getMove( i );
		if ( m != "" ) {
			return true;
		}
	}
	return false;
}

function moveToPgn( move ) {
	if ( move.length < 1 ) {
		return "?";
	}
	
	let result = move;
	result = result.replaceAll( "S", "N" );
	result = result.replaceAll( "L", "B" );
	result = result.replaceAll( "T", "R" );
	result = result.replaceAll( "D", "Q" );
	return result;
}

function toPgn() {
	let pgn = "[Event \"" + getStoreValueStr( "event", "?" ).trim() + "\"]\n";
	pgn += "[Site \"" + getStoreValueStr( "site", "?" ).trim() + "\"]\n";
	let dateStr = getStoreValueStr( "date", "" );
	if ( dateStr.length < 1 ) {
		dateStr = "????.??.??";
	} else {
		let d = new Date( dateStr );
		dateStr = d.getFullYear() + ".";
		dateStr += String( d.getMonth() + 1 ).padStart( 2, "0" ) + ".";
		dateStr += String( d.getDate() ).padStart( 2, "0" );
	}
	pgn += "[Date \"" + dateStr + "\"]\n";
	pgn += "[Round \"" + getStoreValueStr( "round", "?" ) + "\"]\n";
	pgn += "[White \"" + getStoreValueStr( "white", "?" ).trim() + "\"]\n";
	pgn += "[Black \"" + getStoreValueStr( "black", "?" ).trim() + "\"]\n";
	let resultStr = getStoreValueStr( "result", "*" );
	pgn += "[Result \"" + resultStr + "\"]\n";
	pgn += "[WhiteElo \"" + getStoreValueStr( "white_elo", "?" ) + "\"]\n";
	pgn += "[BlackElo \"" + getStoreValueStr( "black_elo", "?" ) + "\"]\n";
	pgn += "[TimeControl \"" + getStoreValueStr( "time_control", "?" ).trim() + "\"]\n";
	pgn += "\n";

	let movesStr = getStoreValueStr( "moves", null );
	if ( movesStr != null ) {
		let moves = JSON.parse( movesStr );
		for ( let i = 0; i < moves.length; ++i ) {
			if ( ( i % 2 ) == 0 ) {
				pgn += Math.floor( (i + 2) / 2 ) + ". ";
			}
			pgn += moveToPgn( moves[ i ] ) + " ";
		}
	}

	if ( resultStr != "*" ) {
		pgn += resultStr;
	}

	return pgn;
}

function focusCurrentMove() {
	let cell = getCell( currentPly );
	cell.className = "moves_cell_focus";
}

function unfocusCurrentMove() {
	let cell = getCell( currentPly );
	cell.className = "moves_cell";
}

function scrollToCurrentMove() {
	let cell = getCell( currentPly );
	cell.scrollIntoView( false );
}

function addRow( moveNum ) {
	let tab = document.getElementById( "moves_table" );
	let row = tab.insertRow( -1 );
	row.className = "moves_row";
	let cell0 = row.insertCell( 0 );
	cell0.className = "moves_cell_num";
	let cell1 = row.insertCell( 1 );
	cell1.className = "moves_cell";
	let cell2 = row.insertCell( 2 );
	cell2.className = "moves_cell";
	cell0.innerHTML = moveNum.toString();
}

function addRows( cnt ) {
	let startMove = (nbOfPlies / 2) + 1;
	for ( let i = startMove; i < startMove + cnt; ++i ) {
		addRow( i );
	}
	nbOfPlies += ( cnt * 2 );
}

function deleteAllRows() {
	let tab = document.getElementById( "moves_table" );
	tab.innerHTML = "";
}

function confirmMove() {
	if ( getCurrentMove() != "" ) {
		unfocusCurrentMove();
		currentPly++;
		if ( currentPly >= nbOfPlies ) {
			addRows( 20 );
		}
		focusCurrentMove();
		scrollToCurrentMove();
	}
}

function insertMove() {
	let end = getMove( nbOfPlies - 1 );
	if ( end != "" ) {
		addRows( 20 );
	}
	for ( let i = nbOfPlies - 1; i > currentPly; --i ) {
		let tmp = getMove( i - 1 );
		setMove( i, tmp );
	}
	setCurrentMove( "" );
}

function deleteMove() {
	if ( getCurrentMove() != "" ) {
		setCurrentMove( "" );
		return;
	}
	for ( let i = currentPly; i < nbOfPlies - 2; ++i ) {
		let tmp = getMove( i + 1 );
		setMove( i, tmp );
	}
	if ( currentPly > 0 ) {
		unfocusCurrentMove();
		currentPly--;
		focusCurrentMove();
		scrollToCurrentMove();
	}
}

function updateEnabled() {
	let enter = document.getElementById( "enter_button" );
	enter.disabled = ( getCurrentMove() == "" );

	let insert = document.getElementById( "insert_button" );
	insert.disabled = currentMoveIsAtEnd();

	let del = document.getElementById( "delete_button" );
	del.disabled = ( !moveExist() && currentPly == 0 );
}

function updateHeader() {
	let white = getStoreValueStr( "white", "Vit" );
	if ( white.length < 1 ) {
		white = "Vit";
	}
	let black = getStoreValueStr( "black", "Svart" );
	if ( black.length < 1 ) {
		black = "Svart";
	}
	let headerWhite = document.getElementById( "header_white_name" );
	let headerBlack = document.getElementById( "header_black_name" );
	headerWhite.innerHTML = white;
	headerBlack.innerHTML = black
}

function getStoreValueStr( key, defaultValue ) {
	let store = window.sessionStorage;
	let result = store.getItem( key );
	if ( result == null || result.length < 1 ) {
		result = defaultValue;
	}
	return result;
}

function getStoreValueNum( key, defaultValue ) {
	let resultStr = getStoreValueStr( key, null );
	let result = defaultValue;
	if ( resultStr != null ) {
		result = parseInt( resultStr );
	}
	return result;
}

function setStoreValue( key, value ) {
	let store = window.sessionStorage;
	store.setItem( key, value );
}

function gameSettings( show ) {
	let settings = document.getElementById( "game_settings" );
	if ( show ) {
		let form = document.getElementById( "game_settings_form" );
		let elements = form.elements;

		elements.white.value = getStoreValueStr( "white", "" );
		elements.white_elo.value = getStoreValueNum( "white_elo", null );
		elements.black.value = getStoreValueStr( "black", "" );
		elements.black_elo.value = getStoreValueNum( "black_elo", null );
		elements.date.valueAsDate = getStoreValueStr( "date", null );
		elements.site.value = getStoreValueStr( "site", "" );
		elements.event.value = getStoreValueStr( "event", "" );
		elements.round.value = getStoreValueNum( "round", null );
		elements.time_control.value = getStoreValueStr( "time_control", "" );
		elements.result.value = getStoreValueStr( "result", "*" );

		settings.style.display = "block";
	} else {
		settings.style.display = "none";
	}
}

function newGame() {
	let confirmNew = confirm( "Delete current game and start a new?" );
	if ( !confirmNew ) {
		return;
	}
	let store = window.sessionStorage;
	store.clear();
	deleteAllRows();
	location.reload(); 
}

function exportGame() {
	storeSettings();
	let pgn = toPgn();
	alert( pgn );
}

function handleButton( btnValue ) {
	switch ( btnValue ) {
	
		case "enter":
			confirmMove();
			break;

		case "ins":
			insertMove();
			break;

		case "del":
			deleteMove();
			break;

		case "game":
			gameSettings( true );
			break;

		case "ok":
			gameSettings( false );
			break;

		case "new":
			newGame();
			break;

		case "export":
			exportGame();
			break;

		default:
			let val = getCurrentMove();
			val += btnValue;
			setCurrentMove( val );
			break;
	}

	updateEnabled();
	setStoreValue( "currentPly", currentPly );
	setStoreValue( "nbOfPlies", nbOfPlies );
	storeMoves();
}

function handleTableClick( target ) {
	let cell = target;
	let rowIndex = cell.closest( "tr" ).rowIndex;
	let cellIndex = cell.cellIndex;
	if ( cellIndex < 1 ) {
		return;
	}
	let ply = ( rowIndex * 2 ) + ( cellIndex - 1 );
	unfocusCurrentMove();
	currentPly = ply;
	focusCurrentMove();
	updateEnabled();
	setStoreValue( "currentPly", currentPly );
}

function storeSettings() {
	let form = document.getElementById( "game_settings_form" );
	let elements = form.elements;

	setStoreValue( "white", elements.white.value );
	setStoreValue( "white_elo", elements.white_elo.value );
	setStoreValue( "black", elements.black.value );
	setStoreValue( "black_elo", elements.black_elo.value );
	setStoreValue( "date", elements.date.value );
	setStoreValue( "site", elements.site.value );
	setStoreValue( "event", elements.event.value );
	setStoreValue( "round", elements.round.value );
	setStoreValue( "time_control", elements.time_control.value );
	setStoreValue( "result", elements.result.value );
}

function handleForm( event ) {
	if ( event.preventDefault ) {
		event.preventDefault();
	}
	storeSettings();
	updateHeader();
	gameSettings( false );
}

function storeMoves() {
	let moves = new Array();
	let lastMove = -1;
	for ( let i = 0; i < nbOfPlies; ++i ) {
		let m = getMove( i );
		moves[ i ] = m;
		if ( m != "" ) {
			lastMove = i;
		}
	}
	moves.length = lastMove + 1;
	setStoreValue( "moves", JSON.stringify( moves ) );
}

function restoreMoves() {
	let movesStr = getStoreValueStr( "moves", null );
	if ( movesStr == null ) {
		return;
	}
	let moves = JSON.parse( movesStr );
	for ( let i = 0; i < moves.length; ++i ) {
		setMove( i, moves[ i ] );
	}
}

function setupEventHandlers() {
	let inputParent = document.getElementById( "input" );
	inputParent.addEventListener( "click", function( event ) {
		if ( event.target.type != "button" ) {
			return;
		}
		let btnValue = event.target.getAttribute( "data-value" );
		if ( !btnValue ) {
			btnValue = event.target.innerHTML;
		}
		handleButton( btnValue );
	});
	
	let movesParent = document.getElementById( "moves" );
	movesParent.addEventListener( "click", function( event ) {
		handleTableClick( event.target );
	});

	let gameForm = document.getElementById( "game_settings_form" );
	if ( gameForm.attachEvent ) {
		gameForm.attachEvent( "submit", handleForm );
	} else {
		gameForm.addEventListener( "submit", handleForm );
	}
}

function init() {
	updateHeader();
	setupEventHandlers();

	currentPly = getStoreValueNum( "currentPly", 0 );
	let tmpNbOfPlies = getStoreValueNum( "nbOfPlies", 120 );
	addRows( tmpNbOfPlies / 2 );
	restoreMoves();
	focusCurrentMove();
	scrollToCurrentMove();
	updateEnabled();
}
