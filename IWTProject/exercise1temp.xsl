<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  
  <xsl:template match="/*">
    <table>
    	<thead>
    		<xsl:for-each select="*[1]/*"><th><xsl:value-of select="name()" /></th></xsl:for-each>
   	    </thead>
   	 <xsl:apply-templates select="*">
        <xsl:sort select="year" order="ascending"/>
      </xsl:apply-templates>
    </table> 
  </xsl:template>

  <xsl:template match="/*/*">
    <tr>
      <xsl:apply-templates select="*"/>
    </tr>
  </xsl:template>
  
  <xsl:template match="/*/*/*">
    <!--selecting the text nodes-->
    <td><xsl:value-of select="."/></td>
  </xsl:template>
</xsl:stylesheet>