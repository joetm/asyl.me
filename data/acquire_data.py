#coding:utf-8
import gzip # for working with gzip files
# for getting file over HTTP
# import wget 
# import urlgrabber
import urllib

# pandas
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


def preBuild(site):
    """
    Gets and unzips the data from eurostat
    """

    # Inspect the site configuration, and retrieve an `optimize` list.
    # optimize = site.config.get("optimize", [])

    # search_paths = sys.path
    # directory = search_paths[0]
    # sys.path.append(directory + '/wget')

    files = {
        'tps00170.tsv': 'http://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing/file/data/tps00170.tsv.gz',
        #'tps00171.tsv': 'http://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing/file/data/tps00171.tsv.gz',
        #'tps00189.tsv': 'http://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing/file/data/tps00189.tsv.gz',
        #'tps00190.tsv': 'http://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing/file/data/tps00190.tsv.gz',
        #'tps00191.tsv': 'http://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing/file/data/tps00191.tsv.gz',
        #'tps00192.tsv': 'http://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing/file/data/tps00192.tsv.gz',
        #'tps00193.tsv': 'http://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing/file/data/tps00193.tsv.gz',
        #'tps00194.tsv': 'http://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing/file/data/tps00194.tsv.gz',
        #'tps00195.tsv': 'http://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing/file/data/tps00195.tsv.gz'
    }

    relpath = "src/"

    for filename, url in files.iteritems():
        # print "Acquiring " + filename

        # http://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing/file/data/tps00189.tsv.gz

        # gzip_filename = urlgrabber.urlgrab(url, relpath + filename + '.gz')

        gzip_filename = filename + '.gz'

        # testfile = urllib.URLopener()
        # testfile.retrieve(url, relpath + filename + '.gz')

        # url produces 'ERR_CONTENT_DECODING_FAILED' !


        print "Unzipping " + gzip_filename
        # open
        inF = gzip.GzipFile(relpath + gzip_filename, 'rb')
        s = inF.read()
        inF.close()
        # write
        filepath = relpath + filename
        outF = file(relpath + filename, 'wb')
        outF.write(s)
        outF.close()

        generateFigures(filename, filepath, 'png')



def generateFigures(filename, filepath, ftype='png'):
    """
    Generate figures
    """

    # f = open(filepath, 'r')

    frame = pd.DataFrame.from_csv(filepath, sep='\t') #header=1
    #print frame.head(1)

    #print '------'
    
    #s = frame.iloc[1]
    #print s

    #print '------'
    
    print frame.ix[2012]
    
    #s = pd.Series(frame, index=index)

    # plot
    # ts = pd.Series(s, index=['2008','2009','2010','2011','2012','2013','2014'])

    #print s

    #df = pd.DataFrame(np.random.randn(1000, 4), index=ts.index, columns=list('ABCD'))

    #df = df.cumsum()
    #af = ts.cumsum()
    #ax = af.plot()
    #fig = ax.get_figure()
    #fig.savefig('./' + ftype + '/' + filename + '.' + ftype)


preBuild(None)


