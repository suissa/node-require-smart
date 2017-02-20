'use strict'

const fs = require('fs')
const path = require('path')

const utils = require('./utils')
const loader = require('./loader')
const painter = require('./painter')

/*
 * This will print a clear vision of what's going to be included where
 */
module.exports = (folder, opts) => {

  const folderBase = path.basename(folder)

  // A few helping letiables
  const POINTER = painter.white('.')

  // Logs header
  const header = pad(` Loading tree for '${folderBase}' as root `, 80, '=', true, true)
  const footer = pad('', header.length, '=', true)

  console.log(painter.blue(footer))
  console.log(painter.blue(header))
  console.log(painter.blue(footer))
  console.log()
    
  // Keep track of all loaded trees
  let loadedTree = []

  const toInfo = ( spec ) => {
    const absNodes = spec.absNodes
    const filePath = path.relative( folder, spec.folder )
    const folderPath = spec.file 

    // Check if it will be merged (if already exists, or, its root)

    const absNodesStr = absNodes.join('/')
    loadedTree.push( absNodesStr )

    const createInfo = ( absNodes ) => {

      // Compile last path (if existent)
      const lastNode = absNodes.slice(-1)[0]

      // Will it merge?
      const willMerge = loadedTree.includes( absNodesStr ) || ( absNodesStr == '' )

      let info = painter.dim(' ▪ ')

      info += ( willMerge )
                ? painter.blue( '[WILL MERGE]' ) 
                : painter.cyan( '[ WILL SET ]' )

      // Compile object path
      info += ' ' + painter.cyan( absNodes.slice( 0, -1 ).join( POINTER ))

      info += ( lastNode )
                ? (absNodes.length > 1 ? POINTER : '') + painter.yellow( lastNode )
                : painter.red( 'root' )

      // Final line string
      info += ' with:'

      // Present path
      info += painter.dim('\n                require( ' + painter.dim('\''))

      // info += painter.dim('-> ')
      info += painter.cyan( filePath ? filePath + '/' : '' ) + painter.yellow( spec.file )
      info += painter.dim( '\'') + painter.dim( ' )' )

      return info
    }

    console.log( createInfo( absNodes ) )
    console.log()
  }

  const treeSpecs = loader.readTree( folder, opts )
                          .sort( loader.specsSorter )
                          .map( toInfo )

  // Logs footer
  console.log()
  console.log( painter.blue( footer ) )
  console.log()
}

// Right or/and Left pad string with wanted char
function pad( string, len, fill, right, left ) {
  string = string || ''
  fill = fill || ' '
  right = right === undefined ? true : right
  left = left === undefined ? false : left

  // Avoid infinite loop
  if ( !right && !left )
    right = true;

  // Make sure at least one char is in place
  const inPlace = ( fill.length > 0 ) ? fill : ' ' 

  let tam = string.length
  while ( tam-- ) {
    string = ( left ? inPlace : '' ) + string + ( right ? inPlace : '' )
  }

  return string
}