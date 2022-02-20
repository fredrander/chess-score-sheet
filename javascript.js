let currentHalfMoveIndex = 0;
let nbOfHalfMoves = 0;

function getCell( halfMoveIndex ) {
	let tab = document.getElementById( "moves_table" );
	let rowIndex = Math.floor( halfMoveIndex / 2 );
	let cellIndex = 1 + ( halfMoveIndex % 2 );
	let cell = tab.rows[ rowIndex ].cells[ cellIndex ];
	return cell;
}

function getMove( halfMoveIndex ) {
	return getCell( halfMoveIndex ).innerHTML;
}

function setMove( halfMoveIndex, move ) {
	getCell( halfMoveIndex ).innerHTML = move;
}

function getCurrentMove() {
	return getMove( currentHalfMoveIndex );
}

function setCurrentMove( move ) {
	setMove( currentHalfMoveIndex, move );
}

function currentMoveIsAtEnd() {
	for ( let i = currentHalfMoveIndex; i < nbOfHalfMoves; ++i ) {
		let m = getMove( i );
		if ( m != "" ) {
			return false;
		}
	}
	return true;
}

function moveExist() {
	for ( let i = 0; i < nbOfHalfMoves; ++i ) {
		let m = getMove( i );
		if ( m != "" ) {
			return true;
		}
	}
	return false;
}

function focusCurrentMove() {
	let cell = getCell( currentHalfMoveIndex );
	cell.className = "moves_cell_focus";
}

function unfocusCurrentMove() {
	let cell = getCell( currentHalfMoveIndex );
	cell.className = "moves_cell";
}

function scrollToCurrentMove() {
	let cell = getCell( currentHalfMoveIndex );
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
	let startMove = (nbOfHalfMoves / 2) + 1;
	for ( let i = startMove; i < startMove + cnt; ++i ) {
		addRow( i );
	}
	nbOfHalfMoves += ( cnt * 2 );
}

function confirmMove() {
	if ( getCurrentMove() != "" ) {
		unfocusCurrentMove();
		currentHalfMoveIndex++;
		if ( currentHalfMoveIndex >= nbOfHalfMoves ) {
			addRows( 20 );
		}
		focusCurrentMove();
		scrollToCurrentMove();
	}
}

function insertMove() {
	let end = getMove( nbOfHalfMoves - 1 );
	if ( end != "" ) {
		addRows( 20 );
	}
	for ( let i = nbOfHalfMoves - 1; i > currentHalfMoveIndex; --i ) {
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
	
	for ( let i = currentHalfMoveIndex; i < nbOfHalfMoves - 2; ++i ) {
		let tmp = getMove( i + 1 );
		setMove( i, tmp );
	}
	if ( currentHalfMoveIndex > 0 ) {
		unfocusCurrentMove();
		currentHalfMoveIndex--;
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
	del.disabled = ( !moveExist() );
}

function gameSettings( show ) {
	let settings = document.getElementById( "game_settings" );
	if ( show ) {
		settings.style.display = "block";
	} else {
		settings.style.display = "none";
	}
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

		default:
			let val = getCurrentMove();
			val += btnValue;
			setCurrentMove( val );
			break;
	}

	updateEnabled();
}

function handleTableClick( target ) {
	let cell = target;
	let rowIndex = cell.closest( "tr" ).rowIndex;
	let cellIndex = cell.cellIndex;
	if ( cellIndex < 1 ) {
		return;
	}

	let halfMoveIndex = ( rowIndex * 2 ) + ( cellIndex - 1 );
	unfocusCurrentMove();
	currentHalfMoveIndex = halfMoveIndex;
	focusCurrentMove();
	updateEnabled();
}

function init() {
	addRows( 60 );
	focusCurrentMove();
	updateEnabled();

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

	let gameDate = document.getElementById( "input_date" ).valueAsDate = new Date();
}
